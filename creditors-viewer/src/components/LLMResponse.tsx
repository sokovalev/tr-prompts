import { memo } from "react";
import { getRubFormatter } from "@/utils/getRubFormatter";

type TLLMResponse = {
  группа: string;
  требования: {
    подгруппа: string;
    сумма: number;
    вид: string;
    основание: string;
  }[];
};

const formatter = getRubFormatter();

export const LLMResponse = memo(
  ({ response, short }: { response: string | null; short?: boolean }) => {
    if (!response) return null;
    const llmResponse = JSON.parse(response) as TLLMResponse;
    return (
      <div>
        <h3>{llmResponse.группа}</h3>
        <ul>
          {llmResponse.требования.map((требование) => (
            <li key={JSON.stringify(требование)}>
              <b>{требование.подгруппа}</b> -{" "}
              {formatter.format(требование.сумма)}
              {!short && (
                <>
                  <span> - {требование.вид}</span>
                  <br />
                  <p>{требование.основание}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

LLMResponse.displayName = "LLMResponse";
