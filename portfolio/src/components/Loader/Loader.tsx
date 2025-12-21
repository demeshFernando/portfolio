import LoaderStyles from './Loader.module.css';

type LoaderType = {
  size?: number;
  color?: string;
};

export default function Loader(props: LoaderType){
    let width = '50';
    let height = '50';
    let color = 'white';

    if(props && props.size) {
      width = props.size + '';
      height = props.size + '';
    }
    if(props && props.color) {
      color = props.color;
    }
    return <svg className={LoaderStyles.buffer} viewBox="0 0 50 50" width={width} height={height}>
    <circle
      className={LoaderStyles.path}
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke={color}
      strokeWidth="4"
    />
  </svg>;
}