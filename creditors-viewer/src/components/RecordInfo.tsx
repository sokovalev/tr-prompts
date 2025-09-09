import { memo } from "react";
import zip from "lodash/zip";
import { credit_requirement } from "@/generated/prisma";
import { getRubFormatter } from "@/utils/getRubFormatter";

const formatter = getRubFormatter();
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
        <li>{record.status}</li>
        {payouts.map(([ocherednost, razmer, vid_objazatelstva, osnovanie]) => (
          <li key={ocherednost + (razmer || "").toString()}>
            <b>{ocherednost}</b> - {tryFormatRazmer(razmer)}
            {!short && (
              <>
                <span> - {vid_objazatelstva}</span>
                <br />
                <p>{osnovanie}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }
);
RecordInfo.displayName = "RecordInfo";
