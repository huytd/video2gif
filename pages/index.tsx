import type { NextPage } from 'next'
import Head from 'next/head'
import { useRef } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
    const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className={styles.container}>
      <Head>
        <title>Video To GIF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <form ref={formRef} action='/api/convert' method="post" encType="multipart/form-data">
              <p>Select the video file to convert to GIF</p>
              <p>
                  FPS: <input type="number" name="fps" defaultValue="15" /> &nbsp;
                  Width: <input type="number" name="width" defaultValue="480" />
              </p>
              <input type="file" name="source" accept='video/*' onChange={() => formRef?.current?.submit()} />
          </form>
      </main>
    </div>
  )
}

export default Home
