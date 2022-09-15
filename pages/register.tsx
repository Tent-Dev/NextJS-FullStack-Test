import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form } from "antd";
import myStyles from '../styles/MyComponent.module.css'

const Register: NextPage = () => {
  const router = useRouter();
  const clickRegister = () =>{
    router.push('/')
  }
  return(
      <div className={styles.container}>
    {/* <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head> */}

    <main className={styles.main}>
      <div style={{'marginBottom': 10, 'fontSize': 20, 'fontWeight': 'bold'}}>
        สร้างบัญชีผู้ใช้
      </div>
      <div style={{'marginBottom': 10}}>
        <div>
          <Input className={myStyles.cspan} size='large' placeholder='อีเมล'></Input>
        </div>
        <div>
          <Input className={myStyles.cspan} size='large' type={'password'} placeholder='รหัสผ่าน'></Input>
        </div>
        <div>
        <Input className={myStyles.cspan} size='large' type={'password'} placeholder='ยืนยันรหัสผ่าน'></Input>
        </div>
        <div>
        <Checkbox>ฉันยอมรับเงื่อนไขและข้อตกลงการใช้งาน</Checkbox>
        </div>
      </div>
      <div>
        <div>
          <Button className={`${myStyles.cspan} ${myStyles.cbutton}`} type="primary" onClick={() => clickRegister()}>ยืนยัน</Button>
        </div>
      </div>
    </main>

    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{' '}
        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
    </footer>
  </div>
  )
}

export default Register