import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from './Icons';

export default function Icon(props: { icon: keyof typeof icons }){
    return <FontAwesomeIcon icon={icons[props.icon]} />;
}