import Link from "next/link";
import { XIcon } from "lucide-react";
import { getRecord } from "./actions";
import omit from "lodash/omit";
import { RecordInfo } from "@/components/RecordInfo";
import { credit_requirement } from "@/generated/prisma";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;

  if (!recordId) {
    return <div>Record ID is required</div>;
  }

  const record = await getRecord(Number(recordId));

  if (!record) {
    return <div>Record not found</div>;
  }

  return (
    <div className="p-4">
      <header className="text-2xl font-bold flex items-center justify-between mb-4">
        {recordId} {record?.fio_zapolnyaushego}
        <Link href="/">
          <XIcon />
        </Link>
      </header>

      <div className="grid grid-cols-[auto_1fr] gap-4 mb-4">
        <span className="font-bold">ФИО заполняющего</span>
        <span>{record.fio_zapolnyaushego}</span>

        <span className="font-bold">Наименование кредитора</span>
        <span>{record.name_creditor}</span>

        <span className="font-bold">ИНН</span>
        <span>
          {record.inn ? (
            record.inn
          ) : (
            <span className="italic">Отсутствует</span>
          )}
        </span>

        <span className="font-bold">Ссылка на акт</span>
        <span>
          {record.link_osn_akt ? (
            <Link href={record.link_osn_akt}>{record.link_osn_akt}</Link>
          ) : (
            <span className="italic">Нет ссылки на акт</span>
          )}
        </span>

        <span className="font-bold">Статус</span>
        <span>
          {record.status ? (
            record.status
          ) : (
            <span className="italic">Нет статуса</span>
          )}
        </span>

        <span className="font-bold">Основание</span>
        <span>
          {record.osnovanie ? (
            record.osnovanie
          ) : (
            <span className="italic">Отсутствует</span>
          )}
        </span>

        <span className="font-bold">Очередность</span>
        <span>
          <RecordInfo record={record as credit_requirement} />
        </span>

        <span className="font-bold">Разбор LLM</span>
        <span>
          {record.llm_response ? (
            <pre className="whitespace-pre-wrap p-2 bg-muted rounded-md">
              {record.llm_response}
            </pre>
          ) : (
            <span className="italic">Отсутствует</span>
          )}
        </span>
      </div>

      <pre className="whitespace-pre-wrap bg-muted rounded-md p-2">
        {JSON.stringify(omit(record, ["pdf_text"]), null, 2)}
      </pre>
    </div>
  );
}
