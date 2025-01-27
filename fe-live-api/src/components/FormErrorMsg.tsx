const FormErrorMessage = (props: {
  message: string | JSX.Element;
  classes?: string;
}): JSX.Element => {
  const { message, classes } = props;

  return <p className={`text-xs text-red-500 ${classes}`}>{message}</p>;
};

export default FormErrorMessage;
