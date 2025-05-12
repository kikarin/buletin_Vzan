const BubbleLayer = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 flex items-center justify-center">
      {Array.from({ length: 5 }).map((_, index) => {
        const delay = -index * 90;
        const bubbleStyles = [
          { transform: "scale(1)", top: "10%", left: "60%" },
          { transform: "scale(2)", top: "1%", left: "30%" },
          { transform: "scale(0.45)", top: "82%", left: "47%" },
          { transform: "scale(0.45)", top: "70%", right: "20%" },
          { transform: "scale(0.35)", bottom: "24%", left: "23%" },
        ];

        return (
          <div
            key={index}
            className="bubble absolute animate-bubble-move"
            style={{
              width: "170px",
              height: "170px",
              borderRadius: "50%",
              animationDelay: `${delay}s`,
              position: "absolute",
              ...bubbleStyles[index],
            }}
          >
            {/* Highlight Glow */}
            <div
              className="absolute"
              style={{
                top: "50px",
                left: "45px",
                width: "30px",
                height: "30px",
                background: "#fff",
                borderRadius: "50%",
                filter: "blur(10px)",
                zIndex: 10,
              }}
            />
            <div
              className="absolute"
              style={{
                top: "80px",
                left: "80px",
                width: "20px",
                height: "20px",
                background: "#fff",
                borderRadius: "50%",
                filter: "blur(8px)",
                zIndex: 10,
              }}
            />

            {/* Colored Borders */}
            <span className="absolute inset-[10px] border-l-[15px] border-[#0fb4ff] rounded-full blur-[8px]" />
            <span className="absolute inset-[10px] border-r-[15px] border-[#ff4484] rounded-full blur-[8px]" />
            <span className="absolute inset-[10px] border-t-[15px] border-[#ffeb3b] rounded-full blur-[8px]" />
            <span className="absolute inset-[30px] border-l-[15px] border-[#ff4484] rounded-full blur-[12px]" />
            <span
              className="absolute inset-[10px] border-b-[10px] border-white rounded-full blur-[8px]"
              style={{ transform: "rotate(330deg)" }}
            />
          </div>
        );
      })}


    </div>
  );
};

export default BubbleLayer;
