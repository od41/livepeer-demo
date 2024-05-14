import logo from './logo.svg'
import './App.css'
import { useQuery } from '@apollo/client'
import { TranscodersQueryDocument, TranscodersQueryQuery as TranscodersQuery, Pool, Maybe, Transcoder as TranscoderType } from '../.graphclient'

type Transcoder = Array<(
  Pick<TranscoderType, 'id' | 'activationRound' | 'deactivationRound' | 'lastActiveStakeUpdateRound' | 'feeShare' | 'rewardCut' | 'totalVolumeUSD' | 'active' | 'totalStake'>
  & { pools?: Maybe<Array<(
    { __typename: 'Pool' }
    & Pick<Pool, 'id' | 'totalStake'>
    & { delegate: Pick<TranscoderType, 'id'> }
  )>> }
)>;
function TranscoderDisplay({transcoder}: {transcoder: any}) {
  const {
    active,
    deactivationRound,
    id: account,
    rewardCut,
    totalStake,
    totalVolumeUSD
  } = transcoder
  console.log(transcoder)
  return <div>
    Status: {active ? "active" : "inactive"}
    deactivationRound: {deactivationRound}
    account: {account}
    rewardCut: {rewardCut}
    totalStake: {totalStake}
    totalVolumeUSD: {totalVolumeUSD}
  </div>
}
function App() {
  const result = useQuery<TranscodersQuery>(TranscodersQueryDocument)

  const { data, loading, error, refetch } = result
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Graph Client with Apollo Example</p>
        <p>
          <button type="button" onClick={() => refetch()} disabled={loading}>
            Re Execute Query
          </button>
        </p>
        <p>{loading ? 'Loading...' : 'You can find the result below...'}</p>
        <fieldset>
          {data && (
            <form>
              <h1>Transcoders: {data?.protocols[0].numActiveTranscoders}</h1>
              <br />
              <label>Data</label>
              <br />
              <div>
                {data?.transcoders.map((transcoder, index) => <TranscoderDisplay key={`trans-${transcoder?.id}`} transcoder={transcoder} />)}
              </div>

              {/* <textarea value={JSON.stringify(data, null, 2)} readOnly rows={25} /> */}
            </form>
          )}
          {error && (
            <form>
              <label>Error</label>
              <br />
              <textarea value={JSON.stringify(error, null, 2)} readOnly rows={25} />
            </form>
          )}
        </fieldset>
      </header>
    </div>
  )
}

export default App
