import { Flex } from "@mantine/core";
import { CCard } from "./ccard";
import gachImage from "@/public/pic/gach.jpg";
import styles from "./ccard.module.css";

export const CategoryCards = ({ data, category }: any) => {
  const url = gachImage;
  return (
    <div
      className={`${styles.container}`}
      style={{
        flexWrap: "wrap",
        display: "flex",
        //justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      {data.map((item: any) => (
        <CCard name={item.name} url={url} category={category}></CCard>
      ))}
    </div>
  );
};
