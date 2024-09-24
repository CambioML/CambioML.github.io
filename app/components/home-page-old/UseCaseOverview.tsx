'use client';

import { useState } from 'react';
import UseCaseTab from './UseCaseTab';

enum TAB {
  ML,
  DATA,
  PORTFOLIO,
}

const UseCaseOverview = () => {
  const [tab, setTab] = useState(TAB.ML);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setTab(index);
  };

  const selectedStyles = 'text-neutral-800 bg-cambio-blue shadow-md';
  const unselectedStyles =
    'text-neutral-500 bg-neutral-200 hover:bg-neutral-300 hover:shadow-md hover:text-neutral-700 transition-all duration-200 ease-in-out';
  const commonStyles = 'cursor-pointer text-2xl p-3 rounded-lg';

  return (
    <div className="flex flex-col items-center align-center w-full">
      <div className="h-[100px] w-full flex justify-between py-5">
        <div
          className={`${commonStyles} ${tab === TAB.ML ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.ML)}
        >
          AI Engineer
        </div>
        <div
          className={`${commonStyles} ${tab === TAB.DATA ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.DATA)}
        >
          Data Engineer
        </div>
        <div
          className={`${commonStyles} ${tab === TAB.PORTFOLIO ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.PORTFOLIO)}
        >
          Portfolio Managers
        </div>
      </div>
      <div className="lg:h-[800px] py-5 rounded-lg">
        {tab === TAB.ML && (
          <UseCaseTab
            code={`from any_parser import AnyParser

op = AnyParser(example_apikey)

content_result = op.extract(example_local_file)`}
            benefits={['Get your extracted data for RAG or LLM finetuning ready']}
            image="/images/graphics/cambio-flow-ml-20240708.png"
            alt="DATA rag chatbot demo"
            detailsPath="/solutions/finance"
          />
        )}
        {tab === TAB.DATA && (
          <UseCaseTab
            code={`from any_parser import AnyParser

example_prompt = "Return table in a JSON format."

op = AnyParser(example_apikey)

qa_result = op.parse(example_local_file, example_prompt)`}
            benefits={['Get your extracted tables ready to load into your database']}
            image="/images/graphics/cambio-flow-data-20240708.png"
            alt="DATA rag chatbot demo"
            detailsPath="/solutions/finance"
          />
        )}
        {tab === TAB.PORTFOLIO && (
          <UseCaseTab
            benefits={['Get your data for RAG or LLM finetuning in few lines of code']}
            image="/images/graphics/cambio-flow-portfolio-20240708.png"
            alt="PORTFOLIO Chat Comparisons"
            demo="/images/pykoi/pykoi-rag-chatbot-modify.gif"
            detailsPath="/solutions/finance"
          />
        )}
      </div>
    </div>
  );
};

export default UseCaseOverview;
