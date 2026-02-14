import React, { useCallback, useEffect, type JSX } from 'react';
import './caraouselStyles.css';
import { usePortfolioSilentModel } from '../Hooks/usePortfolioModel';

type CarauselContentComponentTypeProps = {
    Content: {
        ID: number;
        Img?: string;
        Header: string;
        SubHeader?: string;
        Body: string;
    }[];
    SelectedRdoID: string;
    SetSelectedRadio: (selectedRdoID: string) => void;
};

type CarauselDotProps = {
    Content: {
        ID: number;
        Header: string;
    }[];
    SelectedRdoID: string;
};

export type CarauselOptions = {
    ContentType: CarauselContentComponentTypeProps['Content']
};

export function CarauselContent(props: CarauselContentComponentTypeProps) {
    const carauselSilentModel = usePortfolioSilentModel({
        model: {
            activeRdo: '',
            setMiddleCarauselID: true,
            SetSelectedRdoID: props.SetSelectedRadio
        },
    });

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        carauselSilentModel.binders.setToModel('activeRdo', e.target.value);
        props.SetSelectedRadio(e.target.value);
    };

    const goToNextCarauselCard = useCallback(() => {
        const currentSelectedCarauselID = carauselSilentModel.binders.getValue('activeRdo');
        const activeIndex = props.Content.findIndex(co => co.ID.toString() === currentSelectedCarauselID);
        if(activeIndex >= 0) {
            const fnSetSelectedRdo = carauselSilentModel.binders.getValue('SetSelectedRdoID');
            const nxtRdo = (props.Content[(activeIndex + 1) % props.Content.length]);
            carauselSilentModel.binders.setToModel('activeRdo', nxtRdo.ID.toString());
            fnSetSelectedRdo(nxtRdo.ID.toString());
        }
    }, [carauselSilentModel.binders, props.Content]);

    // setting the default carausel IDs
    useEffect(() => {
        const middleCarauselID = props.Content[0].ID.toString();
        if(carauselSilentModel.binders.getValue('setMiddleCarauselID')) {
            carauselSilentModel.binders.setToModel('activeRdo', middleCarauselID);
            props.SetSelectedRadio(middleCarauselID);
            carauselSilentModel.binders.setToModel('setMiddleCarauselID', false);
        }
    }, [carauselSilentModel.binders, props]);

    // this will set the interval to handle carausel auto rotation
    useEffect(() => {
        const id = window.setInterval(() => goToNextCarauselCard(), 10000);
        return () => clearInterval(id);
    }, [goToNextCarauselCard]);

    const radios: JSX.Element[] = [];
        const carauselCards: JSX.Element[] = [];

        props.Content.map(carausel => {
        radios.push(
            <input
                key={carausel.ID + 'radios'}
                type="radio"
                name="card"
                id={'c-' + carausel.ID}
                checked={props.SelectedRdoID === carausel.ID.toString()}
                value={carausel.ID.toString()}
                onChange={handleRadioChange}
            />);
        carauselCards.push(<label key={carausel.ID + 'cardLabel'} htmlFor={'c-' + carausel.ID} className="carausel-item">
            <div className="caraousel-main_content">
                {carausel.ID.toString() === props.SelectedRdoID && <div className="img">{carausel.Img && <img src={carausel.Img} />}</div>}

                <div className="caraousel-content">
                    <h1>{carausel.Header}</h1>
                    {carausel.SubHeader && <h4>{carausel.SubHeader}</h4>}
                    <p>{carausel.Body}</p>

                    <div className="caraousel-social"></div>
                </div>
            </div>
        </label>);
    });

    return <div className='carausel-slider'>
        {radios}
        <div className="caraousel-cards">
            {carauselCards}
        </div>
    </div>;
}

export function CarauselDots(props: CarauselDotProps) {
    const content = props.Content.map(dot =>
    <div
        key={dot.ID + 'dot'}
        className={`${props.SelectedRdoID === dot.ID + '' ? 'checked' : ''}`}
        id={'c-' + dot.ID}>
    </div>);

    return <div className="dots">
        {content}
    </div>;
}

export class Carausel {
    /*
        Sometimes the card may not display in the carausel the reason is because
        that card's specific ID is not in the 'stylesPreparedList'

        NOTE: Please make sure before you enter any new ID into that list
        you create the respective styles to that new ID to behave in the carausel
        without any errors. and the styles should be included into 'carauselStyles.css' file
        in that file ids were named as 'c-1, c-2 etc...'
    */
    private stylesPreparedList: number[] = [1, 2, 3, 4, 5];
    private carauselData: CarauselContentComponentTypeProps['Content'] = [];
    private carauselDots: CarauselDotProps['Content'] = [];

    constructor(carauselData: CarauselContentComponentTypeProps['Content'] | null) {
        if(carauselData) {
            this.prepareCarauselData(carauselData);
            this.prepareCarauselDotsData();
        }
    }

    get CarauselOptions() {
        return this.carauselData;
    }

    get CarauselDotOptions() {
        return this.carauselDots;
    }

    get styleIDs () {
        return this.stylesPreparedList;
    }

    private prepareCarauselData(carauselData: CarauselContentComponentTypeProps['Content']) {
        // only styles prepared IDs can be included into the list
        const filteredCarauselData = carauselData.filter(carausel => {
            const isInPreparedStyles = this.stylesPreparedList.filter(list => list === carausel.ID);
            return isInPreparedStyles.length > 0;
        });
        this.carauselData = filteredCarauselData;
    }

    private prepareCarauselDotsData() {
        this.carauselData.map(carausel => {
            this.carauselDots.push({
                ID: carausel.ID,
                Header: carausel.Header,
            });
        });
    }
}