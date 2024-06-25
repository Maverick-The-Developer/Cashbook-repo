import { IoTrash } from 'react-icons/io5'

type TProps = {
  list: TListItem[]
  total: { income: number; outcome: number }
  deleteThis: (id: number) => void
}
export default function CashFlowList({
  list,
  total,
  deleteThis,
}: TProps) {
  return (
    <>
      <div className='list-header'>
        <p>날짜</p>
        <p>내용</p>
        <p>수입</p>
        <p>지출</p>
        <p></p>
      </div>
      {list?.map((item, index) => (
        <div key={index} className='list-item'>
          <p>{item.date}</p>
          <p>{item.description}</p>
          <p>{item.income.toLocaleString('ko-KR')}</p>
          <p>{item.outcome.toLocaleString('ko-KR')}</p>
          <p>
            {index === list.length - 1 ? (
              (item.income - item.outcome).toLocaleString('ko-KR')
            ) : (
              <button
                type='button'
                className='border-none'
                onClick={() => deleteThis(item.id || 0)}
              >
                <IoTrash size={24} />
              </button>
            )}
          </p>
        </div>
      ))}
      <div className='flex border-t border-t-black border-b border-b-[#ccc] py-2 items-center'>
        <p className='w-[120px] text-center'></p>
        <p className='flex-1 text-center'>총계</p>
        <p className='w-[120px] text-right text-[#1010e0]'>
          {total.income.toLocaleString('ko-KR')}
        </p>
        <p className='w-[120px] text-right text-[#e01010]'>
          {total.outcome.toLocaleString('ko-KR')}
        </p>
        <p className='w-[120px] text-right'>
          {(total.income - total.outcome).toLocaleString('ko-KR')}
        </p>
      </div>
    </>
  )
}
