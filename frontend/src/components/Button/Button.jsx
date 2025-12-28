const Button = ({
  label,
  bgColor,
  icon: Icon,
  textColor,
  onClick,
  submit,
  borderColor,
}) => {
  return (
    <button
      onClick={onClick}
      onSubmit={submit}
      className={`text-base ${textColor} font-DMsans ${bgColor} border ${borderColor} px-5 py-2 rounded-md font-medium tracking-tight cursor-pointer`}>
      <span className="flex gap-2">
        {Icon} {label}
      </span>
    </button>
  );
};

export default Button;
