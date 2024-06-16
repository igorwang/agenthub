import { IconSvgProps } from "@/types";

import React from "react";

export const AcmeLogo = (props: IconSvgProps) => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36" {...props}>
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const TagIcon = (props: IconSvgProps) => (
  <svg
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.707 2.293A.997.997 0 0 0 11 2H6a.997.997 0 0 0-.707.293l-3 3A.996.996 0 0 0 2 6v5c0 .266.105.52.293.707l10 10a.997.997 0 0 0 1.414 0l8-8a.999.999 0 0 0 0-1.414l-10-10zM13 19.586l-9-9V6.414L6.414 4h4.172l9 9L13 19.586z"
      fill="currentColor"
    />
    <circle cx="8.353" cy="8.353" fill="currentColor" r="1.647" />
  </svg>
);

export const OcticonChevronRightIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12L8.72 6.28a.75.75 0 0 1 .018-1.042a.75.75 0 0 1 1.042-.018l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0"
    />
  </svg>
);

export const OcticonChevronDownIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M5.22 8.22a.75.75 0 0 0 0 1.06l6.25 6.25a.75.75 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939L6.28 8.22a.75.75 0 0 0-1.06 0"
    />
  </svg>
);

export const OcticonKebabHorizontalIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M20 14a2 2 0 1 1-.001-3.999A2 2 0 0 1 20 14M6 12a2 2 0 1 1-3.999.001A2 2 0 0 1 6 12m8 0a2 2 0 1 1-3.999.001A2 2 0 0 1 14 12"
    />
  </svg>
);

export const TopicFolderIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M6.5 15.5h7v-1h-7zm0-4h11v-1h-11zM4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.981l2 2h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zm0-1h14.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19l-2-2h-4.58q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173M4 18V6z"
    />
  </svg>
);

export const BookIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 16 16"
  >
    <path
      fill="currentColor"
      d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.74 3.74 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324l.004-5.073l-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574M8.755 4.75l-.004 7.322a3.75 3.75 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25"
    />
  </svg>
);

export const DiscussionIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M0 2.75C0 1.783.784 1 1.75 1h12.5c.967 0 1.75.783 1.75 1.75v9.5A1.75 1.75 0 0 1 14.25 14H8.061l-2.574 2.573A1.457 1.457 0 0 1 3 15.543V14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.189l2.72-2.719a.75.75 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm20.5 6h-3.5a.75.75 0 0 1 0-1.5h3.5c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0 1 22.25 20H21v1.543a1.457 1.457 0 0 1-2.487 1.03L15.939 20H10.75A1.75 1.75 0 0 1 9 18.25v-1.465a.75.75 0 0 1 1.5 0v1.465c0 .138.112.25.25.25h5.5c.199 0 .39.079.53.22l2.72 2.719V19.25a.75.75 0 0 1 .75-.75h2a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25m-9.72-3.22l-5 5a.747.747 0 0 1-1.06 0l-2.5-2.5a.749.749 0 1 1 1.06-1.06L7 8.689l4.47-4.469a.749.749 0 1 1 1.06 1.06"
    />
  </svg>
);

export const PlusIcon = (props: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 16 16"
  >
    <path
      fill="currentColor"
      d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2"
    />
  </svg>
);

export const DocumentIcon: React.FC<IconSvgProps> = ({
  size = 24, // Default size to 24
  width,
  height,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox="0 0 20 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M19.638 8.945c0-.228-.07-.439-.19-.613l.002.004a1.516 1.516 0 0 0-.06-.08l-.005-.006a1.03 1.03 0 0 0-.063-.069l-.01-.01l-.028-.029L11.462.321a.83.83 0 0 0-.07-.063l-.022-.02l-.054-.04l-.027-.019a1.787 1.787 0 0 0-.058-.035l-.025-.015a1.205 1.205 0 0 0-.081-.039l-.034-.014l-.054-.02l-.039-.012l-.061-.016l-.031-.007a1.357 1.357 0 0 0-.092-.014H1.092C.492.007.005.491.001 1.09v21.818c0 .603.489 1.091 1.091 1.091h17.454c.603 0 1.091-.489 1.091-1.091V8.973zM11.781 3.72l4.13 4.135h-4.13zM2.182 21.818V2.181h7.42v6.767c0 .603.489 1.091 1.091 1.091h6.767v11.779z"
      />
      <path
        fill="currentColor"
        d="M13.454 17.454H6.15a1.091 1.091 0 0 0 0 2.182h.032h-.002h7.304a1.091 1.091 0 0 0 0-2.182h-.032zm0-4.363H6.15a1.091 1.091 0 0 0 0 2.182h.032h-.002h7.304a1.091 1.091 0 0 0 0-2.182h-.032z"
      />
    </svg>
  );
};
export const VideoIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || width}
      height={size || height}
      viewBox="0 0 1536 1792"
      {...props}
    >
      <path
        fill="currentColor"
        d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22m384 1528V640H992q-40 0-68-28t-28-68V128H128v1536zM768 768q52 0 90 38t38 90v384q0 52-38 90t-90 38H384q-52 0-90-38t-38-90V896q0-52 38-90t90-38zm492 2q20 8 20 30v576q0 22-20 30q-8 2-12 2q-14 0-23-9l-265-266v-90l265-266q9-9 23-9q4 0 12 2"
      />
    </svg>
  );
};

export const DefaultFileIcon: React.FC<IconSvgProps> = ({
  size = 32, // Default size to 24
  width,
  height,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5zM13 14H4V2h5v4h4zm-3-9V2l3 3z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const DeleteIcon: React.FC<IconSvgProps> = ({
  size = 24, // Default size to 24
  width,
  height,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox="0 0 40 40"
      fill="currentColor"
      {...props}
    >
      <path
        fill="currentColor"
        d="M21.499 19.994L32.755 8.727a1.064 1.064 0 0 0-.001-1.502c-.398-.396-1.099-.398-1.501.002L20 18.494L8.743 7.224c-.4-.395-1.101-.393-1.499.002a1.05 1.05 0 0 0-.309.751c0 .284.11.55.309.747L18.5 19.993L7.245 31.263a1.064 1.064 0 0 0 .003 1.503c.193.191.466.301.748.301h.006c.283-.001.556-.112.745-.305L20 21.495l11.257 11.27c.199.198.465.308.747.308a1.058 1.058 0 0 0 1.061-1.061c0-.283-.11-.55-.31-.747z"
      />{" "}
    </svg>
  );
};

export const ConfigIcon: React.FC<IconSvgProps> = ({
  size = 24, // Default size to 24
  width,
  height,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox="0 0 48 48"
    >
      <g
        fill="none"
        stroke="#000"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
      >
        <path d="M41.5 10H35.5" />
        <path d="M27.5 6V14" />
        <path d="M27.5 10L5.5 10" />
        <path d="M13.5 24H5.5" />
        <path d="M21.5 20V28" />
        <path d="M43.5 24H21.5" />
        <path d="M41.5 38H35.5" />
        <path d="M27.5 34V42" />
        <path d="M27.5 38H5.5" />
      </g>
    </svg>
  );
};
