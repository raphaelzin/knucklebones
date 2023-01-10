import { FC, ReactNode } from "react";
import "./die.css";

const Pip = () => <span className="pip" />;

interface FaceProps {
  children: ReactNode
}

const Face: FC<FaceProps> = ({ children }) => <div className="face">{children}</div>;

interface DieProps {
  value: number
}

const Die: FC<DieProps> = ({ value }) => {
  let pips = Number.isInteger(value)
    ? Array(value)
      .fill(0)
      .map((_, i) => <Pip key={i} />)
    : null;
  return <Face>{pips}</Face>;
};

export default Die;
