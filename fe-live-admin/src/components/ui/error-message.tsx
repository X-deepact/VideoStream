import { JSX } from "react";

const ErrorMessage = (props: {
  msg: string | JSX.Element;
  className?: string;
}) => {
  const { msg, className } = props;
  return (
    <>
      <p className={`text-red-500 text-sm font-semibold mt-1 ${className}`}>
        {msg}
      </p>
    </>
  );
};

export default ErrorMessage;
