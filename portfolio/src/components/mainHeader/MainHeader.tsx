import { useEffect, useRef, useState } from 'react';
import ButtonStyles from './mainHeader.module.css';
import usePortfolioCollection from '../Hooks/usePortfolioCollection';

import Icon from '../portfolioIcon/Icon';
import { ContactType } from '../utils/constants';
import { usePortfolioModel } from '../Hooks/usePortfolioModel';
import { useBaseStorage } from '../utils/mainContext';

//#region type definition
type HeaderModelType = {
    ID: number;
    Name: string;
};

type MainHeaderModelType = {
    IsStruck: boolean;
    ActiveElementID: number;
};

type ContactInformationType = {
    ID: number;
    IsPrimary: boolean;
    ContactTypeID: number;
    Contact: string;
    ClickHandler: string | null;
};

type ContactButtonType = {
    StruckedState: boolean;
    EnableStatus: boolean;
};

type contactButtonHoverDeciderType = {
    type: 'phone' | 'email' | 'linkedIn',
    ID: 1 | 2 | 3,
};

const headerItems: HeaderModelType[] = [
    {
        ID: 1,
        Name: 'Work',
    },
    {
        ID: 2,
        Name: 'Undergraduate',
    },
    {
        ID: 3,
        Name: 'School'
    }
];

const contactInformation: ContactInformationType[] = [
    {
        ID: 1,
        ContactTypeID: 1,
        IsPrimary: true,
        Contact: '(077) 048 6069',
        ClickHandler: null,
    },
    {
        ID: 2,
        ContactTypeID: 2,
        IsPrimary: true,
        Contact: 'wdemeshfernando@gmail.com',
        ClickHandler: null,
    },
    {
        ID: 3,
        ContactTypeID: 3,
        IsPrimary: true,
        Contact: 'link to the item',
        ClickHandler: '',
    }
];
//#endregion

//#region outer functions
function getDecidedContactClassNames(struckState: boolean) {
    let initialClasses = ButtonStyles.contact;

    if(struckState) {
        return initialClasses += ' ' + ButtonStyles['active-contact'];
    }
    return initialClasses;
}

async function fetchHeaderItems(): Promise<HeaderModelType[]>{
    return headerItems;
}

async function fetchContactInformation(): Promise<ContactInformationType[]>{
    return contactInformation;
}

function openLink(link: string | null) {
    if(link) window.open(link, '_blank', 'noopener,noreferrer');
}
//#endregion

//#region components
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

    let contactDetails = helpers.nullOrEmptyViewHolder;

    if(contactInfo && contactInfo.length && contactInfo.length === 3) {
        contactDetails = contactInfo.map(contact => {
            if(contact.ContactTypeID === ContactType.Email) {
                return <div
                    onMouseEnter={() => handleMouseEnter('email')}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleContactInfoClick('email', 2)}
                    className={getDecidedContactClassNames(props.StruckedState)}
                    key={contact.ID}
                >
                    {hovered !== 0 && hovered.type === 'email' && <div className={ButtonStyles['contact-number']}>{contact.Contact}</div>}
                    <Icon icon='Email' />
                </div>;
            } else if (contact.ContactTypeID === ContactType.Link) {
                return <div
                    onClick={() => handleLinkTypeInfoClick(contact.ClickHandler)}
                    className={getDecidedContactClassNames(props.StruckedState)}
                    key={contact.ID}
                >
                    <Icon icon='LinkedIn' />
                </div>;
            }

            return <div
                onMouseEnter={() => handleMouseEnter('phone')}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleContactInfoClick('phone', 1)}
                className={getDecidedContactClassNames(props.StruckedState)}
                key={contact.ID}
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
export default function MainHeader(props: { EnableStatus: boolean }){
    const headerRef = useRef<HTMLDivElement>(null);
    const { model: mainHeaderModel, helpers: mainHeaderModelHelper } = usePortfolioModel<MainHeaderModelType>({ model: {
        IsStruck: false,
        ActiveElementID: 0,
    }});
    const { collection: headerCollection, helpers} = usePortfolioCollection<HeaderModelType>({ collection: null, helperAttributes: { name: 'Headers', fetchFn: fetchHeaderItems } });
    const storage = useBaseStorage();

    //we have to disable the performing the button clicks
    const onNavElementClick = (ID: number) => {
        if(props.EnableStatus) {
            mainHeaderModelHelper.binders.setToModel('ActiveElementID', ID);
        }
    };

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

    useEffect(() => {
        if(!headerCollection) helpers.fetchCollection();
    }, [headerCollection, helpers]);

    let innerContent = helpers.nullOrEmptyViewHolder;

    if(headerCollection && headerCollection.length) {
        innerContent = headerCollection.map((headerItem, index) => {
            if(!mainHeaderModel.ActiveElementID && !index) {
                return <div onClick={() => onNavElementClick(headerItem.ID)} key={headerItem.ID} className={`${ButtonStyles['header-element-overlay']} ${!mainHeaderModel.IsStruck ? ButtonStyles['active-box-element'] : ButtonStyles['active-round-element']}`}>
                    <p className={ButtonStyles['header-element']}>{headerItem.Name}</p>
                </div>;
            } else if (mainHeaderModel.ActiveElementID === headerItem.ID) {
                return <div onClick={() => onNavElementClick(headerItem.ID)} key={headerItem.ID} className={`${ButtonStyles['header-element-overlay']} ${!mainHeaderModel.IsStruck ? ButtonStyles['active-box-element'] : ButtonStyles['active-round-element']}`}>
                    <p className={ButtonStyles['header-element']}>{headerItem.Name}</p>
                </div>;
            }
            return <div onClick={() => onNavElementClick(headerItem.ID)} key={headerItem.ID} className={`${ButtonStyles['header-element-overlay']}`}>
                <p className={ButtonStyles['header-element']}>{headerItem.Name}</p>
            </div>;
        });
    }

    return <>
        <div ref={headerRef} style={{ padding: '10px', height: '1px', width: '100%', backgroundColor: '#280404', }}></div>
        <div className={ButtonStyles['header-overlay']}>
            <div className={`${ButtonStyles.logo}${mainHeaderModel.IsStruck ? ' ' + ButtonStyles['active-logo'] : ''}`}>
                {!mainHeaderModel.IsStruck ? storage?.getConfigItem('ShortName') : storage?.getConfigItem('PortfolioUserName')}
            </div>
            <div className={`${ButtonStyles.header}${mainHeaderModel.IsStruck ? ' ' + ButtonStyles.active : ''}`}>
                {innerContent}
            </div>
            <div className={ButtonStyles['contact-wrapper']}>
                <ContactButton StruckedState={mainHeaderModel.IsStruck} EnableStatus={props.EnableStatus} />
            </div>
        </div>
    </>;
}
//#endregion