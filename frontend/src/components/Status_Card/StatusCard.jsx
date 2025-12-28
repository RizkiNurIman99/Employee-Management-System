const StatusCard = ({
  title,
  value,
  bgColor,
  textColor,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div
      className={`p-4 rounded-md flex flex-col justify-between h-[130px] border border-border dark:border-border ${bgColor}`}>
      <h2 className="text-base font-DMsans font-medium text-dark dark:text-white">
        {title}
      </h2>
      <div className="flex items-center justify-between">
        <p
          className={`text-3xl font-DMsans text-dark dark:text-white font-bold ${textColor}`}>
          {value}
        </p>
        <Icon className={`size-6 ${iconColor}`} />
      </div>
    </div>
  );
};

export default StatusCard;
