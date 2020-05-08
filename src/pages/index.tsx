import dynamic from 'next/dynamic'

const TopPage = dynamic(() => import('../components/TopPage'), { ssr: false })

export default () => {
  return <TopPage />
}
