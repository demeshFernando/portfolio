import { useEffect, useRef, useState } from 'react';
import ButtonStyles from './mainHeader.module.css';
import usePortfolioCollection from '../Hooks/usePortfolioCollection';

import Icon from '../portfolioIcon/Icon';
import { ContactType } from '../utils/constants';
import { usePortfolioModel, usePortfolioSilentModel } from '../Hooks/usePortfolioModel';
import { useBaseStorage } from '../utils/mainContext';
import { common } from '../utils/common';
import { HomeAPI } from '../../controllers/HomeController';

//#region type definition
type MainHeaderPropsType = {
    RefreshKey: number;
    ActiveNavID: number;
    IsElementEnabled: boolean;
    onActiveElementChange: (elementID: number) => void;
};

type HeaderModelType = {
    NavID: number;
    Name: string;
    SortOrder: number;
};

type MainHeaderModelType = {
    IsStruck: boolean;
};

type ContactInformationType = {
    ContactID: number;
    ContactTypeID: number;
    Contact: string;
};

type MiddleSectionType = {
    IsStruck: boolean;
    ElementEnableStatus: boolean;
};

type ContactButtonType = {
    StruckedState: boolean;
    EnableStatus: boolean;
};

type contactButtonHoverDeciderType = {
    type: 'phone' | 'email' | 'linkedIn',
    ID: 1 | 2 | 3,
};
//#endregion

//#region collections
async function fetchNavs(SourceId: number) {
    return await HomeAPI.navHeadersGet(SourceId);
}

async function fetchContactInformation(): Promise<ContactInformationType[]>{
    return HomeAPI.primaryContactGet();
}
//#endregion

//#region outer functions
function getDecidedContactClassNames(struckState: boolean) {
    let initialClasses = ButtonStyles.contact;

    if(struckState) {
        return initialClasses += ' ' + ButtonStyles['active-contact'];
    }
    return initialClasses;
}

function openLink(link: string | null) {
    if(link) window.open(link, '_blank', 'noopener,noreferrer');
}
//#endregion

//#region components
function MiddleSection(props: MiddleSectionType) {
    const { collection: headerCollection, helpers } = usePortfolioCollection<HeaderModelType>({ collection: null, helperAttributes: {
        name: 'Headers',
        fetchFn: () => fetchNavs(silentModel.binders.getValue('SourceID')),
        afterFetchTrig: () => {
            const loadStateAttributes = storage?.Pop('MajorSourceIdsLoaded');

            // since navs have been loaded we can make that false in the base storage
            if(loadStateAttributes) {
                loadStateAttributes.isNavsLoaded = true;
                storage?.Push('MajorSourceIdsLoaded', loadStateAttributes);
                if(loadStateAttributes.isBottomContentLoaded && loadStateAttributes.isFocusedContentLoaded && !storage?.Pop('DisableSourceLoader')) {
                    storage?.Push('DisableSourceLoader', true);
                }
            }
        },
     } });
    const silentModel = usePortfolioSilentModel({
        model: {
            SourceID: 0,
        },
    });
    const middleSectionModel = usePortfolioModel({
        model: {
            NavID: 0,
        }
    });
    const storage = useBaseStorage();

    //we have to disable the performing the button clicks
    const onNavElementClick = (ID: number) => {
        if(props.ElementEnableStatus && storage && storage.Pop('DisableSourceLoader')) {
            storage.Push('NavID', ID);
        }
    };

    useEffect(() => {
        if(storage?.Pop('SourceID')) {
            silentModel.binders.setToModel('SourceID', storage?.Pop('SourceID'));
            helpers.doAnInitialFetch();
        }
    }, [helpers, silentModel.binders, storage]);
    useEffect(() => {
        helpers.fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storage, storage?.Model.SourceID]);
    // This use effect will trigger when navID initially got changed
    useEffect(() => {
        storage?.Push('NavID', middleSectionModel.model.NavID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [middleSectionModel.model.NavID]);

    let innerContent = common.nullOrEmptyViewHolder(helpers.nullOrEmptyViewHolderAttributes);

    if(headerCollection && headerCollection.length) {
        const activeNavId = storage?.Pop('NavID') || 0;
        if(!activeNavId) middleSectionModel.helpers.binders.setToModel('NavID', headerCollection[0].NavID);
        innerContent = headerCollection.map((headerItem, index) => {
            if(!activeNavId && !index) {
                return <div onClick={() => onNavElementClick(headerItem.NavID)} key={headerItem.NavID} className={`${ButtonStyles['header-element-overlay']} ${!props.IsStruck ? ButtonStyles['active-box-element'] : ButtonStyles['active-round-element']}`}>
                    <p className={ButtonStyles['header-element']}>{headerItem.Name}</p>
                </div>;
            } else if (activeNavId === headerItem.NavID) {
                return <div onClick={() => onNavElementClick(headerItem.NavID)} key={headerItem.NavID} className={`${ButtonStyles['header-element-overlay']} ${!props.IsStruck ? ButtonStyles['active-box-element'] : ButtonStyles['active-round-element']}`}>
                    <p className={ButtonStyles['header-element']}>{headerItem.Name}</p>
                </div>;
            }
            return <div onClick={() => onNavElementClick(headerItem.NavID)} key={headerItem.NavID} className={`${ButtonStyles['header-element-overlay']}`}>
                <p className={ButtonStyles['header-element']}>{headerItem.Name}</p>
            </div>;
        });
    }

    return <>{innerContent}</>;
}

function ContactButton(props: ContactButtonType){
    const [hovered, setHovered] = useState<contactButtonHoverDeciderType | 0>(0);
    const hoverTimeout = useRef<number | null>(null);

    const { collection: contactInfo, helpers } = usePortfolioCollection<ContactInformationType>({ collection: null, helperAttributes: { name: 'Contacts', fetchFn: fetchContactInformation } });

    const handleMouseEnter = (identifier: contactButtonHoverDeciderType['type']) => {
        if(props.EnableStatus) {
            hoverTimeout.current = setTimeout(() => {
                if(identifier === 'phone') setHovered({ type: 'phone', ID: 1});
                else if(identifier === 'email') setHovered({ type: 'email', ID: 2 });
                else setHovered({ type: 'linkedIn', ID: 3 });
            }, 500);
        }
    };

    const handleMouseLeave = () => {
        if(hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHovered(0);
    };

    const handleContactInfoClick = (type: contactButtonHoverDeciderType['type'], ID: contactButtonHoverDeciderType['ID']) => {
        if(props.EnableStatus) {
            setHovered({ type: type, ID: ID });
        }
    };

    const handleLinkTypeInfoClick = (link: string | null) => {
        if(props.EnableStatus && link) {
            setHovered(0);
            openLink(link);
        }
    };

    useEffect(() => {
        if(!contactInfo) helpers.fetchCollection();
    }, [helpers, contactInfo]);

    let contactDetails = common.nullOrEmptyViewHolder(helpers.nullOrEmptyViewHolderAttributes);

    if(contactInfo && contactInfo.length && contactInfo.length === 3) {
        contactDetails = contactInfo.map(contact => {
            if(contact.ContactTypeID === ContactType.Email) {
                return <div
                    onMouseEnter={() => handleMouseEnter('email')}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleContactInfoClick('email', 2)}
                    className={getDecidedContactClassNames(props.StruckedState)}
                    key={contact.ContactID}
                >
                    {hovered !== 0 && hovered.type === 'email' && <div className={ButtonStyles['contact-number']}>{contact.Contact}</div>}
                    <Icon icon='Email' />
                </div>;
            } else if (contact.ContactTypeID === ContactType.Link) {
                return <div
                    onClick={() => handleLinkTypeInfoClick(contact.Contact)}
                    className={getDecidedContactClassNames(props.StruckedState)}
                    key={contact.ContactID}
                >
                    <Icon icon='LinkedIn' />
                </div>;
            }

            return <div
                onMouseEnter={() => handleMouseEnter('phone')}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleContactInfoClick('phone', 1)}
                className={getDecidedContactClassNames(props.StruckedState)}
                key={contact.ContactID}
            >
                {hovered !== 0 && hovered.type === 'phone' && <div className={ButtonStyles['contact-number']}>{contact.Contact}</div>}
                <Icon icon='Phone' />
            </div>;
        });
    }

    return contactDetails;
}
//#endregion

//#region main component
export default function MainHeader(props: MainHeaderPropsType){
    const headerRef = useRef<HTMLDivElement>(null);
    const { model: mainHeaderModel, helpers: mainHeaderModelHelper } = usePortfolioModel<MainHeaderModelType>({ model: {
        IsStruck: false,
    }});
    const storage = useBaseStorage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                mainHeaderModelHelper.binders.setToModel('IsStruck', !entry.isIntersecting);
            },{
                root: null,
                threshold: 0,
            }
        );
        if (headerRef.current) observer.observe(headerRef.current);

        return () => {
            if(headerRef!.current) {
                observer.unobserve(headerRef!.current);
            }
        };
    }, [mainHeaderModelHelper]);

    return <>
        <div ref={headerRef} style={{ padding: '10px', height: '1px', width: '100%', backgroundColor: 'var(--background)', }}></div>
        <div className={ButtonStyles['header-overlay']}>
            <div className={`${ButtonStyles.logo}${mainHeaderModel.IsStruck ? ' ' + ButtonStyles['active-logo'] : ''}`}>
                {!mainHeaderModel.IsStruck ? storage?.getConfigItem('ShortName') : storage?.getConfigItem('PortfolioUserName')}
            </div>
            <div className={`${ButtonStyles.header}${mainHeaderModel.IsStruck ? ' ' + ButtonStyles.active : ''}`}>
                <MiddleSection
                    key={props.RefreshKey}
                    ElementEnableStatus={props.IsElementEnabled}
                    IsStruck={mainHeaderModel.IsStruck}
                />
            </div>
            <div className={ButtonStyles['contact-wrapper']}>
                <ContactButton StruckedState={mainHeaderModel.IsStruck} EnableStatus={props.IsElementEnabled} />
            </div>
        </div>
    </>;
}
//#endregion