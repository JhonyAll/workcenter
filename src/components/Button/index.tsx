type propsButton = {
  text: string;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  buttonSubmit: boolean;
};

const ButtonComponent = ({
  text,
  bgColor,
  textColor,
  hoverBgColor,
  buttonSubmit,
}: propsButton) => {
  return (
    <button
      type={buttonSubmit ? "submit" : "button"}
      className={`${
        bgColor + textColor
      } font-bold select-none w-full h-14 rounded hover:bg-transparent border-solid border border-transparent hover:border-slate-700 transition-all ${hoverBgColor}`}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
