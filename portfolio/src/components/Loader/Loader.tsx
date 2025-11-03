import LoaderStyles from './Loader.module.css';

export default function Loader(){
    return <svg className={LoaderStyles.buffer} viewBox="0 0 50 50">
    <circle
      className={LoaderStyles.path}
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="white"
      strokeWidth="4"
    />
  </svg>;
}