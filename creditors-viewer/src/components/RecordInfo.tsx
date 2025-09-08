import { memo } from "react";
import zip from "lodash/zip";
import { credit_requirement } from "@/generated/prisma";

const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});

const tryFormatRazmer = (value?: string) => {
  if (!value) return value;
  const number = Number(value.replaceAll(" ", "").replaceAll(",", "."));
  return Number.isNaN(number) ? value : formatter.format(number);
};

export const RecordInfo = memo(
  ({ record, short }: { record: credit_requirement; short?: boolean }) => {
    if (!record) return null;

    const payouts = short
      ? zip(
          record.ocherednost?.split("|") ?? [],
          record.razmer?.split("|") ?? []
        )
      : zip(
          record.ocherednost?.split("|") ?? [],
          record.razmer?.split("|") ?? [],
          record.vid_objazatelstva?.split("|") ?? [],
          record.osnovanie?.split("|") ?? []
        );

    return (
      <ul>
        {payouts.map(([ocherednost, razmer, vid_objazatelstva, osnovanie]) => (
          <li key={ocherednost + (razmer || "").toString()}>
            {[
              ocherednost,
              tryFormatRazmer(razmer),
              vid_objazatelstva,
              osnovanie,
            ]
              .filter(Boolean)
              .join(" – ")}
          </li>
        ))}
      </ul>
    );
  }
);
RecordInfo.displayName = "RecordInfo";
