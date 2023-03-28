export default function CustomButton({ text, type, onClick }) {
    return (
      <button
        onClick={onClick}
        type={type}
        className="
          font-permanent-marker 
          bg-mainblue 
          hover:bg-accentlavender 
          h-12 
          w-32 
          hover:scale-105 
          opacity-100 
          rounded-lg 
          font-extrabold 
          text-background 
          hover:text-white"
      >
        {text}
      </button>
    );
  }