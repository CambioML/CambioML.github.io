import { useEffect, useState } from 'react';
import { OutputItem } from '../../types/PlaygroundTypes';
import { QAResult } from '@/app/actions/apiInterface';

interface QATableProps {
  qaResult: QAResult;
  updateDisplayTable: (resultList: string[][]) => void;
}

const cellStyle = 'p-2 text-center whitespace-pre-wrap break-words';
const contextColWidth = '50%';
const otherColWidth = '25%';

const QATable = ({ qaResult, updateDisplayTable }: QATableProps) => {
  const [resultList, setResultList] = useState<string[][]>([]);
  useEffect(() => {
    const thisList: string[][] = [];
    qaResult.forEach((itemList) => {
      console.log(itemList);
      itemList.forEach((item) => {
        if (Array.isArray(item.output)) {
          item.output.forEach((outputItem: OutputItem) => {
            outputItem.response.forEach((response) => {
              const { context, question, answer } = response;
              thisList.push([context, question, answer]);
            });
          });
        }
      });
    });
    setResultList(thisList);
    updateDisplayTable(thisList);
  }, [qaResult, updateDisplayTable]);
  return (
    <div className="absolute w-full">
      <table className="border-none w-full table-fixed">
        <colgroup>
          <col style={{ width: contextColWidth }} />
          <col style={{ width: otherColWidth }} />
          <col style={{ width: otherColWidth }} />
        </colgroup>
        <thead>
          <tr>
            <th className={cellStyle}>Context</th>
            <th className={cellStyle}>Question</th>
            <th className={cellStyle}>Answer</th>
          </tr>
        </thead>
        <tbody>
          {resultList.map((rowData, index) => (
            <tr key={index}>
              {rowData.map((value, columnIndex) => (
                <td className={cellStyle} key={columnIndex}>
                  <div>{value}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QATable;
