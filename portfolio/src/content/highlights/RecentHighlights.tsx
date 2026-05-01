import { useEffect } from 'react';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';

import recentHilightsStyles from './recentHilights.module.css';
import HeaderText from '../../components/HeaderText/HeaderText';
import TypeText from '../../components/TypeEffect/TypeText';

import { common } from '../../components/utils/common';
import { HighlightProjectsStatus } from '../../components/utils/constants';
import { graduationPhoto } from './dummyImg';

// #region types and APIS
type HighlightType = {
    HighlightID: number;
    HighlightHeader: string;
    StartDate: Date;
    EndDate?: Date;
    Status: number;
    BackgroundImg: string;
    OtherParas?: string[];
};

const highlights: HighlightType[] = [
    {
        HighlightID: 1,
        HighlightHeader: 'BSC(Honours) in Software Engineering',
        StartDate: new Date('2021-05-01'),
        EndDate: new Date('2025-12-15'),
        Status: HighlightProjectsStatus.Completed,
        BackgroundImg: graduationPhoto,
        OtherParas: ['With a first class averaging 3.7 GPA'],
    },
    {
        HighlightID: 2,
        HighlightHeader: 'Working on a portfolio',
        StartDate: new Date('2026-01-01'),
        Status: HighlightProjectsStatus.InProgress,
        BackgroundImg: graduationPhoto,
    },
];

async function getHighlights(): Promise<HighlightType[]> {
    return highlights;
}
// #endregion

// #region Outer Cmpnts
function HighlightCard(props: {item: HighlightType}) {
    const decideDates = (StartDate: Date, EndDate?: Date) => {
        const startDate = common.formatDateOnly(StartDate);
        const endDate = EndDate ? common.formatDateOnly(EndDate) : null;
        let finalDate = '';
        if(StartDate && EndDate) {
            finalDate = startDate + ' - ' + endDate;
        } else finalDate = startDate;

        return <h4>{finalDate}</h4>;
    };

    const decideStatus = () => {
        switch(props.item.Status) {
            case HighlightProjectsStatus.NotStarted:
                return <p className={recentHilightsStyles['inprogress-text']}>- Not Started</p>;
            case HighlightProjectsStatus.InProgress:
                return <p className={recentHilightsStyles['inprogress-text']}>- InProgress</p>;
            case HighlightProjectsStatus.OnHold:
                return <p className={recentHilightsStyles['inprogress-text']}>- OnHold</p>;
            case HighlightProjectsStatus.Completed:
                return <p className={recentHilightsStyles['completed-text']}>- Completed</p>;
        }
    };

    const addOtherParas = () => {
        if(!props.item.OtherParas) return [<></>];

        return props.item.OtherParas.map((para, index) => <p key={index} className={recentHilightsStyles['other-paras']}>- {para}</p>);
    };

    return <div key={props.item.HighlightID} className={recentHilightsStyles.card}>
            <img src={props.item.BackgroundImg} className={recentHilightsStyles.img} />
            <div className={recentHilightsStyles['card-content']}>
                <h3><TypeText Text={props.item.HighlightHeader} /></h3>
                {decideDates(props.item.StartDate, props.item.EndDate)}
                {decideStatus()}
                {addOtherParas()}
            </div>
        </div>;
}
// #endregion

// #region Export View
export default function RecentHighlights() {
    const highlights = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            name: 'Highlights',
            fetchFn: getHighlights,
        },
    });

    useEffect(() => {
        highlights.helpers.doAnInitialFetch();
    }, [highlights.helpers]);

    if(highlights.collection === null || highlights.collection.length === 0) {
        return common.nullOrEmptyViewHolder(highlights.helpers.nullOrEmptyViewHolderAttributes);
    }

    // if highlights were fetched then let's prepare it
    const cards = highlights.collection.map(highlight => <HighlightCard item={highlight} />);

    return <>
        <HeaderText title='Recent Highlights' alignment='middle' />
        <div className={recentHilightsStyles['card-overlay']}>
            {cards}
        </div>
    </>;
}
// #endregion