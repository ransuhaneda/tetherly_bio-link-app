import sty from './LoadingSpinner.module.scss';

export const LoadingSpinner = () => {
  return (
    <div className={sty.wrapper}>
      {/* From Uiverse.io by Nawsome  */}
      <svg className={sty.pl} width="240" height="240" viewBox="0 0 240 240">
        <circle
          className={`${sty.pl__ring} ${sty.pl__ring_a}`}
          cx="120"
          cy="120"
          r="105"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 660"
          strokeDashoffset="-330"
          strokeLinecap="round"
        ></circle>
        <circle
          className={`${sty.pl__ring} ${sty.pl__ring_b}`}
          cx="120"
          cy="120"
          r="35"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 220"
          strokeDashoffset="-110"
          strokeLinecap="round"
        ></circle>
        <circle
          className={`${sty.pl__ring} ${sty.pl__ring_c}`}
          cx="85"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        ></circle>
        <circle
          className={`${sty.pl__ring} ${sty.pl__ring_d}`}
          cx="155"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        ></circle>
      </svg>
    </div>
  );
};
