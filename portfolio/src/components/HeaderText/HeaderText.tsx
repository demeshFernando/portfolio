import HeaderTextStyles from './headerTextStyles.module.css';

type HeaderTextStyle = {
    title: string;
    alignment?: 'right' | 'left' | 'middle';
};

export default function HeaderText(Props: HeaderTextStyle) {
    let alignment: HeaderTextStyle['alignment'] = 'right';
    let styles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
    };
    if(Props.alignment) {
        alignment = Props.alignment;
    }

    if(alignment === 'left') {
        styles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
        };
    } else if (alignment === 'middle') {
        styles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };
    }

    return <h1 style={styles} className={HeaderTextStyles['title']}>{Props.title}</h1>;
}