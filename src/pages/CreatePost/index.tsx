/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import TipTapRichText from "@components/TipTapRichText";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function CreatePost() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>New Post</h1>
        <div className="flex gap10">
          <button
            className="inactiveBtn"
            onClick={() => {
              navigate("/posts");
            }}
          >
            Cancel
          </button>
          <button className="secondaryBtn" onClick={() => {}}>
            Save As Draft
          </button>
          <button className="primaryBtn" onClick={() => {}}>
            Submit
          </button>
        </div>
      </div>

      <TipTapRichText />
    </div>
  );
}
