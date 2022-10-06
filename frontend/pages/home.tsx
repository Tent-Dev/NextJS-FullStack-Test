import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { AiOutlinePlus, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, Card, PageHeader, Row, Empty } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import ItemBox from '../components/itembox'
import dataDummy from '../components/dummydata'
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import HeaderBar from '../components/header';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useDispatch, connect } from "react-redux";
import _ from 'lodash';
import UserService from "../services/user.service";
import styled from 'styled-components';

const DivDataList = styled.div`
  width: -webkit-fill-available;
`;

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const HomeApp: NextPage = (props: any) => {
  const dispatch = useDispatch();
  const [dataparty,Setdataparty]: any[] = useState([]);
  const [showspin,Setshowspin] = useState(true);
  const [hasmore,Sethasmore] = useState(true);
  const router = useRouter();

  const clickCreate = () =>{
    router.push('/create')
  }

  useEffect(() =>{

    // if(!_.has(props.post.users, 'isLoggedIn')) {
    //   console.log('FALSE')
    //   router.push('/');
    // }else{
      fetchData();
    // }
  },[])

  const joinParty = async (id: number) =>{

    UserService.actionParty(props.post.users.user.userId,id,'join').then(response => {
      const newData = dataparty.findIndex( (obj: { partyId: number; }) => obj.partyId == id);
      dataparty[newData].registered = dataparty[newData].registered+1;
      dispatch({
        type: 'UPDATE_USER',
        data: response.data.data
      });
      
      Setdataparty(dataparty);
    });

  }

  const fetchData = async () =>{
    // axios.defaults.headers.common['Authorization'] = props.post.users.token;
    // await axios.post('http://localhost:3100/api/party').then(response => {
    //   console.log(response.data);
    //   Setdataparty(response.data);
    //   Sethasmore(false);
    //   Setshowspin(false);
    // }).catch(err =>{
    //   console.log(err);

    //   if(err.response.data.code == 1000){
    //     router.push(err.response.data.redirectTo);
    //   }
    // });

    const data = await UserService.getParty().then(response => {
        console.log(response.data);
        Setdataparty(response.data);
        Sethasmore(false);
        Setshowspin(false);
      }).catch(err =>{
        console.log(err);
  
        if(err.response.data.code == 1000){
          router.push(err.response.data.redirectTo);
        }
      });

    // console.log(data);
    
  }

  const InfiniteScrollWarp = () =>{
    return(
      <InfiniteScroll
        dataLength={dataparty.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasmore}
        loader={<div style={{'textAlign': 'center', 'marginTop': 24}}><Spin indicator={antIcon} size='large'/></div>}
        endMessage={
          <p style={{ textAlign: 'center', 'marginTop': 24, 'color': 'gray' }}>
            <b>ผลลัพธ์การค้นหาสิ้นสุดแล้ว</b>
          </p>
        }
        // below props only if you need pull down functionality
        // refreshFunction={fetchData}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }
        style={{ overflow: 'hidden' }}
      >
        <Row gutter={[16, 16]}>
          {dataparty.map((element: { partyId: any; }) => (
            <ItemBox mode={'join'} data={element} key={element.partyId} joinParty={joinParty}/>
          ))}
        </Row>
      </InfiniteScroll>
    )
  }

  return(
    <>
      <HeaderBar
        headerText='รายการปาร์ตี้'
        childElement={
          <>
            <Button className={`${myStyles.cbutton}`} type="primary" icon={<AiOutlinePlus />} onClick={() => clickCreate()} size={'large'} />
          </>
        }
      />
      <div className={styles.container}>
        <main className={styles.main}>
        {showspin ? <Spin indicator={antIcon} size='large'/> : dataparty.length == 0 && !showspin ?
        <Empty description='ไม่พบรายการปาร์ตี้' />
        : 
        <DivDataList>
          <InfiniteScrollWarp/>
        </DivDataList>
        }
        </main>
      </div>
    </>
  )
}

const mapStateToProps = (state: any) => ({ post: state })

export default connect(mapStateToProps)(HomeApp)