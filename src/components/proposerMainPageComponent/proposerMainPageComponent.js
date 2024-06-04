import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { LineChart } from '@mui/x-charts';
import Spinner from '../spinner/spinner';
import { getImageById, fetchUserData, fetchProposalData} from '../../services/apiService';
import Avatar from '../../images/User-512.webp';
import { useNavigate  } from 'react-router-dom';
import dayjs from "dayjs";
import '../CSS/style.css'; 

export const logOut = (navigate) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  navigate('/login');
};



function ProposerMainPage(props) {
  const [appearances, setAppereances] = useState({});
  const [userData, setUserData] = useState(null);
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalDataByDays, setProposalDataByDays] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut(navigate);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  let xAxisData;
  let yAxisData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await fetchUserData();
        const proposalData = await fetchProposalData();
        setProposalData(proposalData);
        const filteredArray = proposalData.filter(item => item.proposer === userDataResponse.proposer.id);
        const statusArray = filteredArray.map(item => item.status);
        const createdAtArray = filteredArray.map(item => item.created_at.split('T')[0]);
        const appearances = {};
        statusArray.forEach(status => {
            if (appearances[status]) {
                appearances[status]++;
            } else {
                appearances[status] = 1;
            }
        });
        appearances["Sum"] = statusArray.length;
        console.log(statusArray);
        setAppereances(appearances);
        const dateCounts = createdAtArray.reduce((counts, date) => {
          counts[date] = (counts[date] || 0) + 1;
          return counts;
        }, {});
        
        const today = new Date();
        const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
        
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        
        const result = [];
        while (currentDate >= endDate) {
          const dateString = currentDate.toISOString().slice(0, 10);
          const count = dateCounts[dateString] || 0; 
          result.push({ date: dateString, count });
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        if (userDataResponse) {
          if(userDataResponse.avatar){
            const imageResponse = await getImageById(userDataResponse.avatar);
            setImageSrc(imageResponse.image);
          }
          setUserData(userDataResponse);
        }
        setProposalDataByDays(result.reverse());
  
  
        setLoading(false);
  
        console.log('User Data:', userDataResponse);
      } catch (error) {
        setError(error.message);
        
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };
  
    fetchData();
  }, []);


  if (proposalDataByDays !== null) {
    xAxisData = proposalDataByDays.map(data => {
      const date = new Date(data.date);
      return date.getTime();
  });
  yAxisData = proposalDataByDays.map(data => {
    const count = data.count;
    return count;
  });
  }

if (loading) {
  return <Spinner/> ;
}
  return (
    <Div>
      <Div2>
        <Column>
          <Div3>
            <Div4>
            <Img
                  loading="lazy"
                  srcSet={imageSrc || Avatar}
                  alt="Person Image"
                  width="65"
                  height="65"
                />
              <Div5>
                <Div15>{userData.first_name}
                <Link to='/edit_profile' style={{marginLeft: '5px'}}>
                <EditButton>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1692 3.64955L9.81876 3.28664L9.45895 3.64645L1.31311 11.7923L1.16667 11.9387V12.1458V13.3333V13.8333H1.66667H2.85417H3.06127L3.20772 13.6869L11.3536 5.54105L11.7134 5.18124L11.3505 4.83084L10.1692 3.64955ZM13.6869 2.47978L12.5202 1.31311L11.8131 2.02022L12.9798 3.18689L13.6869 2.47978ZM13.0064 0.837862L13.0122 0.84421L13.0183 0.850354L14.1641 2.01702L14.1733 2.02638L14.183 2.03524C14.2919 2.13506 14.3676 2.24865 14.416 2.38046C14.4735 2.53727 14.5 2.68746 14.5 2.83333C14.5 2.99692 14.4721 3.14848 14.4179 3.29142C14.3689 3.42065 14.2887 3.54587 14.1673 3.66728L3.33456 14.5H0.5V11.6657L11.3452 0.841093C11.4683 0.729625 11.6007 0.646008 11.7433 0.587008C11.8828 0.529256 12.0296 0.5 12.1875 0.5C12.3455 0.5 12.4978 0.529294 12.6476 0.589238C12.7858 0.644483 12.9039 0.726073 13.0064 0.837862Z" fill="black" stroke="black"/>
                </svg>
                </EditButton>
                </Link> 
                </Div15>
                <Div6>{userData.last_name}</Div6>
                <Div7>Proposer</Div7>
              </Div5>
            </Div4>
            <Div9>
              <Div10>
                <Column2>
                  <Div11>
                    <Div12>
                      <Link to="/add_proposal" style={{ textDecoration: 'none' }}>
                          <Button
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/baf4c644000a2ca7444ec44e15c20fa1c9dd044a60681bc1057ac431dac9c544?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                          > <svg width="67" height="55" viewBox="0 0 67 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M51.7727 51.7727V42.6364H42.6364V36.5454H51.7727V27.4091H57.8636V36.5454H67V42.6364H57.8636V51.7727H51.7727ZM6.09091 54.8182C4.41591 54.8182 2.98201 54.2218 1.7892 53.029C0.596402 51.8362 0 50.4023 0 48.7273V6.09091C0 4.41591 0.596402 2.98201 1.7892 1.7892C2.98201 0.596401 4.41591 0 6.09091 0H48.7273C50.4023 0 51.8362 0.596401 53.029 1.7892C54.2218 2.98201 54.8182 4.41591 54.8182 6.09091V21.3182H48.7273V15.2273H6.09091V48.7273H45.6818V54.8182H6.09091ZM6.09091 9.13636H48.7273V6.09091H6.09091V9.13636Z" fill="#7D7D7D"/>
                            </svg>
                          </Button>
                          <Text style={{ textDecoration: 'none', color: 'black' }}>Add Proposal</Text>
                        </Link>
                      <Link to={`/identify_problem`} style={{ textDecoration: 'none', maxWidth: '120px' }}>
                        <Button
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/baf4c644000a2ca7444ec44e15c20fa1c9dd044a60681bc1057ac431dac9c544?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                        > <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.5 39.6681C28.1895 39.6681 28.7675 39.4349 29.234 38.9685C29.7004 38.502 29.9336 37.924 29.9336 37.2345C29.9336 36.545 29.7004 35.967 29.234 35.5006C28.7675 35.0341 28.1895 34.8009 27.5 34.8009C26.8105 34.8009 26.2325 35.0341 25.766 35.5006C25.2996 35.967 25.0664 36.545 25.0664 37.2345C25.0664 37.924 25.2996 38.502 25.766 38.9685C26.2325 39.4349 26.8105 39.6681 27.5 39.6681ZM25.0664 29.9336H29.9336V15.3319H25.0664V29.9336ZM27.5 55L19.3473 46.969H8.03097V35.6527L0 27.5L8.03097 19.3473V8.03097H19.3473L27.5 0L35.6527 8.03097H46.969V19.3473L55 27.5L46.969 35.6527V46.969H35.6527L27.5 55ZM27.5 48.1858L33.5841 42.1018H42.1018V33.5841L48.1858 27.5L42.1018 21.4159V12.8982H33.5841L27.5 6.81416L21.4159 12.8982H12.8982V21.4159L6.81416 27.5L12.8982 33.5841V42.1018H21.4159L27.5 48.1858Z" fill="#7D7D7D"/>
                        </svg>
                        </Button>
                        <Text style={{ textDecoration: 'none', color: 'black'}}>Identify Problem</Text>
                      </Link>

                      <Link to="/assigned" style={{ textDecoration: 'none' }}>
                        <Button
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/baf4c644000a2ca7444ec44e15c20fa1c9dd044a60681bc1057ac431dac9c544?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                        > <svg width="48" height="54" viewBox="0 0 48 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.2667 40.1333L39.0667 21.3333L35.3333 17.6L20.2667 32.6667L12.6667 25.0667L8.93333 28.8L20.2667 40.1333ZM5.33333 53.3333C3.86667 53.3333 2.61111 52.8111 1.56667 51.7667C0.522222 50.7222 0 49.4667 0 48V10.6667C0 9.2 0.522222 7.94444 1.56667 6.9C2.61111 5.85556 3.86667 5.33333 5.33333 5.33333H16.5333C17.1111 3.73333 18.0778 2.44444 19.4333 1.46667C20.7889 0.488889 22.3111 0 24 0C25.6889 0 27.2111 0.488889 28.5667 1.46667C29.9222 2.44444 30.8889 3.73333 31.4667 5.33333H42.6667C44.1333 5.33333 45.3889 5.85556 46.4333 6.9C47.4778 7.94444 48 9.2 48 10.6667V48C48 49.4667 47.4778 50.7222 46.4333 51.7667C45.3889 52.8111 44.1333 53.3333 42.6667 53.3333H5.33333ZM5.33333 48H42.6667V10.6667H5.33333V48ZM24 8.66667C24.5778 8.66667 25.0556 8.47778 25.4333 8.1C25.8111 7.72222 26 7.24444 26 6.66667C26 6.08889 25.8111 5.61111 25.4333 5.23333C25.0556 4.85556 24.5778 4.66667 24 4.66667C23.4222 4.66667 22.9444 4.85556 22.5667 5.23333C22.1889 5.61111 22 6.08889 22 6.66667C22 7.24444 22.1889 7.72222 22.5667 8.1C22.9444 8.47778 23.4222 8.66667 24 8.66667Z" fill="#7D7D7D" />
                          </svg>

                        </Button>
                        <Text style={{ textDecoration: 'none', color: 'black' }}>Assigned</Text>
                      </Link>
                    </Div12>
                    <Div17>
                      <Link to="/proposals" style={{ textDecoration: 'none' }}>
                        <Button
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/baf4c644000a2ca7444ec44e15c20fa1c9dd044a60681bc1057ac431dac9c544?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                        > <svg width="67" height="72" viewBox="0 0 67 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.7 64.5636C4.8575 64.5636 3.28021 63.9314 1.96813 62.6671C0.656042 61.4027 0 59.8828 0 58.1073V12.9127C0 11.1372 0.656042 9.61729 1.96813 8.35292C3.28021 7.08855 4.8575 6.45636 6.7 6.45636H20.77C21.4958 4.51945 22.7102 2.95917 24.4131 1.7755C26.116 0.591833 28.0283 0 30.15 0C32.2717 0 34.184 0.591833 35.8869 1.7755C37.5898 2.95917 38.8042 4.51945 39.53 6.45636H53.6C55.4425 6.45636 57.0198 7.08855 58.3319 8.35292C59.644 9.61729 60.3 11.1372 60.3 12.9127V34.5415C59.2392 34.0573 58.1504 33.6403 57.0338 33.2906C55.9171 32.9409 54.7725 32.6853 53.6 32.5239V12.9127H6.7V58.1073H26.9675C27.135 59.2909 27.4002 60.4208 27.7631 61.4969C28.126 62.5729 28.5588 63.5952 29.0613 64.5636H6.7ZM6.7 54.8791V58.1073V12.9127V32.5239V32.2818V54.8791ZM13.4 51.6509H27.0513C27.2188 50.521 27.484 49.4181 27.8469 48.342C28.2098 47.266 28.6146 46.2168 29.0613 45.1945H13.4V51.6509ZM13.4 38.7382H33.835C35.6217 37.1241 37.6177 35.779 39.8231 34.703C42.0285 33.6269 44.3875 32.9006 46.9 32.5239V32.2818H13.4V38.7382ZM13.4 25.8255H46.9V19.3691H13.4V25.8255ZM30.15 10.4916C30.8758 10.4916 31.476 10.2629 31.9506 9.8056C32.4252 9.34828 32.6625 8.76989 32.6625 8.07045C32.6625 7.37101 32.4252 6.79263 31.9506 6.33531C31.476 5.87798 30.8758 5.64932 30.15 5.64932C29.4242 5.64932 28.824 5.87798 28.3494 6.33531C27.8748 6.79263 27.6375 7.37101 27.6375 8.07045C27.6375 8.76989 27.8748 9.34828 28.3494 9.8056C28.824 10.2629 29.4242 10.4916 30.15 10.4916ZM50.25 71.02C45.6158 71.02 41.6656 69.4463 38.3994 66.2988C35.1331 63.1513 33.5 59.3447 33.5 54.8791C33.5 50.4134 35.1331 46.6069 38.3994 43.4594C41.6656 40.3119 45.6158 38.7382 50.25 38.7382C54.8842 38.7382 58.8344 40.3119 62.1006 43.4594C65.3669 46.6069 67 50.4134 67 54.8791C67 59.3447 65.3669 63.1513 62.1006 66.2988C58.8344 69.4463 54.8842 71.02 50.25 71.02ZM48.575 64.5636H51.925V56.4932H60.3V53.265H51.925V45.1945H48.575V53.265H40.2V56.4932H48.575V64.5636Z" fill="#7D7D7D"/>
                          </svg>


                        </Button>
                        <Text style={{ textDecoration: 'none', color: 'black' }}>Proposals</Text>
                      </Link>
                      <Link to="/edit_profile" style={{ textDecoration: 'none' }}>
                        <Button
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/baf4c644000a2ca7444ec44e15c20fa1c9dd044a60681bc1057ac431dac9c544?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                        > <svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#7D7D7D"><path d="M501.09-207.3ZM143.33-130v-110.62q0-41.72 20.74-71.87 20.75-30.15 53.65-45.81 68.76-32 132.88-47.38 64.12-15.39 128.83-15.39 39.84 0 78.48 6.09 38.65 6.09 79.05 18.15l-62.83 62.07q-24.43-5.21-46.97-6.99-22.54-1.77-47.16-1.77-57.76 0-112.18 12.02-54.43 12.02-116.89 42.27-13.64 6.14-21.97 19.71-8.33 13.56-8.33 29.8v32.42h280.46v77.3H143.33Zm417.76 27.2v-134.4l223.48-222.23q10.03-10.46 22.58-15.09 12.55-4.63 25.36-4.63 13.49 0 25.94 4.86 12.45 4.86 22.51 14.86l37 38q9.95 10 14.71 22.14 4.76 12.15 4.76 25.06 0 13.23-5.16 26.15-5.16 12.92-15.22 23.04L695.48-102.8H561.09Zm308.67-271.68-37-37 37 37Zm-240 203h38l120.28-121.23-18-19.02-19-18.03-121.28 120.22v38.06Zm140.28-140.28-19-18 37 37-18-19Zm-290-176.67q-69.46 0-116.56-47.23-47.11-47.23-47.11-116.64 0-69.42 47.07-116.41 47.06-46.99 116.52-46.99t116.68 46.96q47.23 46.96 47.23 116.56 0 69.29-47.19 116.52-47.18 47.23-116.64 47.23Zm-.04-77.31q36.04 0 61.18-25.14 25.15-25.14 25.15-61.19 0-36.04-25.1-61.3-25.09-25.26-61.18-25.26t-61.23 25.3q-25.15 25.31-25.15 61.15 0 36.16 25.15 61.3 25.14 25.14 61.18 25.14Zm0-86.33Z"/></svg>
                        </Button>
                        <Text style={{ textDecoration: 'none', color: 'black' }}>Edit Profile</Text>
                      </Link>

                      <Link to="/proposers" style={{ textDecoration: 'none' }}>
                        <Button
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/baf4c644000a2ca7444ec44e15c20fa1c9dd044a60681bc1057ac431dac9c544?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                        > <svg width="67" height="54" viewBox="0 0 67 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50.25 36.85C47.905 36.85 45.9229 36.0404 44.3038 34.4212C42.6846 32.8021 41.875 30.82 41.875 28.475C41.875 26.13 42.6846 24.1479 44.3038 22.5287C45.9229 20.9096 47.905 20.1 50.25 20.1C52.595 20.1 54.5771 20.9096 56.1963 22.5287C57.8154 24.1479 58.625 26.13 58.625 28.475C58.625 30.82 57.8154 32.8021 56.1963 34.4212C54.5771 36.0404 52.595 36.85 50.25 36.85ZM33.5 53.6V48.91C33.5 47.57 33.849 46.3277 34.5469 45.1831C35.2448 44.0385 36.2358 43.215 37.52 42.7125C39.53 41.875 41.6098 41.2469 43.7594 40.8281C45.909 40.4094 48.0725 40.2 50.25 40.2C52.4275 40.2 54.591 40.4094 56.7406 40.8281C58.8902 41.2469 60.97 41.875 62.98 42.7125C64.2642 43.215 65.2552 44.0385 65.9531 45.1831C66.651 46.3277 67 47.57 67 48.91V53.6H33.5ZM26.8 26.8C23.115 26.8 19.9604 25.4879 17.3363 22.8637C14.7121 20.2396 13.4 17.085 13.4 13.4C13.4 9.715 14.7121 6.56042 17.3363 3.93625C19.9604 1.31208 23.115 0 26.8 0C30.485 0 33.6396 1.31208 36.2638 3.93625C38.8879 6.56042 40.2 9.715 40.2 13.4C40.2 17.085 38.8879 20.2396 36.2638 22.8637C33.6396 25.4879 30.485 26.8 26.8 26.8ZM0 53.6V44.22C0 42.3217 0.474583 40.5769 1.42375 38.9856C2.37292 37.3944 3.685 36.18 5.36 35.3425C8.71 33.6675 12.1856 32.3833 15.7869 31.49C19.3881 30.5967 23.0592 30.15 26.8 30.15C28.7542 30.15 30.7083 30.3175 32.6625 30.6525C34.6167 30.9875 36.5708 31.3783 38.525 31.825L35.6775 34.6725L32.83 37.52C31.825 37.2408 30.82 37.0594 29.815 36.9756C28.81 36.8919 27.805 36.85 26.8 36.85C23.5617 36.85 20.3931 37.2408 17.2944 38.0225C14.1956 38.8042 11.2225 39.9208 8.375 41.3725C7.81667 41.6517 7.39792 42.0425 7.11875 42.545C6.83958 43.0475 6.7 43.6058 6.7 44.22V46.9H26.8V53.6H0ZM26.8 20.1C28.6425 20.1 30.2198 19.444 31.5319 18.1319C32.844 16.8198 33.5 15.2425 33.5 13.4C33.5 11.5575 32.844 9.98021 31.5319 8.66812C30.2198 7.35604 28.6425 6.7 26.8 6.7C24.9575 6.7 23.3802 7.35604 22.0681 8.66812C20.756 9.98021 20.1 11.5575 20.1 13.4C20.1 15.2425 20.756 16.8198 22.0681 18.1319C23.3802 19.444 24.9575 20.1 26.8 20.1Z" fill="#7D7D7D"/>
                          </svg>
                        </Button>
                        <Text style={{ textDecoration: 'none', color: 'black' }}>Proposers</Text>
                      </Link>
                    </Div17>
                  </Div11>
                </Column2>
              </Div10>
            </Div9>
          </Div3>
        </Column>
        <Column4>
          <Div25>
            <Div26>
              <Div27>
                <Img8
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba2ecc2a8af9615522bd837955f90aa462b022e2f13c46a05493e77f07595398?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                />
                <Div28>KaizenCloud</Div28>
              </Div27>
              <DropdownWrapper onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
            <Div29>
                <RightMenuBar>
                <Link to={`/profile/${userData.proposer.id}`}>
                <Img
                  src={Avatar}
                  alt="Person Image"
                  width="24"
                  height="24"
                />
                </Link>
                <ProfileName>{userData.first_name}</ProfileName>
              </RightMenuBar>
              </Div29>
            {isHovered && (    
              <DropdownMenu>
                  <Link to={`/profile/${userData.proposer.id}`} style={{ textDecoration: 'none', color: '#333' }}> 
                    <DropdownItem>
                      <TextWrapper>
                        <ProfileText>Profile</ProfileText>
                      </TextWrapper>
                      <svg
                        className="img-icon"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6.5 6.5C5.60625 6.5 4.84115 6.18177 4.20469 5.54531C3.56823 4.90885 3.25 4.14375 3.25 3.25C3.25 2.35625 3.56823 1.59115 4.20469 0.954687C4.84115 0.318229 5.60625 0 6.5 0C7.39375 0 8.15885 0.318229 8.79531 0.954687C9.43177 1.59115 9.75 2.35625 9.75 3.25C9.75 4.14375 9.43177 4.90885 8.79531 5.54531C8.15885 6.18177 7.39375 6.5 6.5 6.5ZM0 13V10.725C0 10.2646 0.11849 9.84141 0.355469 9.45547C0.592448 9.06953 0.907292 8.775 1.3 8.57187C2.13958 8.15208 2.99271 7.83724 3.85937 7.62734C4.72604 7.41745 5.60625 7.3125 6.5 7.3125C7.39375 7.3125 8.27396 7.41745 9.14062 7.62734C10.0073 7.83724 10.8604 8.15208 11.7 8.57187C12.0927 8.775 12.4076 9.06953 12.6445 9.45547C12.8815 9.84141 13 10.2646 13 10.725V13H0ZM1.625 11.375H11.375V10.725C11.375 10.576 11.3378 10.4406 11.2633 10.3187C11.1888 10.1969 11.0906 10.1021 10.9688 10.0344C10.2375 9.66875 9.49948 9.39453 8.75469 9.21172C8.0099 9.02891 7.25833 8.9375 6.5 8.9375C5.74167 8.9375 4.9901 9.02891 4.24531 9.21172C3.50052 9.39453 2.7625 9.66875 2.03125 10.0344C1.90937 10.1021 1.8112 10.1969 1.73672 10.3187C1.66224 10.4406 1.625 10.576 1.625 10.725V11.375ZM6.5 4.875C6.94687 4.875 7.32943 4.71589 7.64766 4.39766C7.96589 4.07943 8.125 3.69687 8.125 3.25C8.125 2.80312 7.96589 2.42057 7.64766 2.10234C7.32943 1.78411 6.94687 1.625 6.5 1.625C6.05312 1.625 5.67057 1.78411 5.35234 2.10234C5.03411 2.42057 4.875 2.80312 4.875 3.25C4.875 3.69687 5.03411 4.07943 5.35234 4.39766C5.67057 4.71589 6.05312 4.875 6.5 4.875Z" fill="#C4C4C4"/>
                      </svg>
                    </DropdownItem>
                  </Link>
                  <DropdownItem onClick={handleLogout}>
                    <TextWrapper>
                      <LogoutText>Logout</LogoutText>
                    </TextWrapper>
                    <svg
                      className="img-icon"
                      width="17"
                      height="15"
                      viewBox="0 0 17 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.0037 4.25V2.625C10.0037 2.19402 9.83123 1.7807 9.52423 1.47595C9.21722 1.1712 8.80084 1 8.36667 1H2.63704C2.20287 1 1.78648 1.1712 1.47948 1.47595C1.17247 1.7807 1 2.19402 1 2.625V12.375C1 12.806 1.17247 13.2193 1.47948 13.524C1.78648 13.8288 2.20287 14 2.63704 14H8.36667C8.80084 14 9.21722 13.8288 9.52423 13.524C9.83123 13.2193 10.0037 12.806 10.0037 12.375V10.75" stroke="#C4C4C4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.27408 7.5H15.7333L13.2778 5.0625M13.2778 9.9375L15.7333 7.5" stroke="#C4C4C4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </DropdownItem>
                </DropdownMenu> 
                      )}
            </DropdownWrapper>     
              
            </Div26>
            <Div32>
              <Div37>Activity</Div37>
              <Div33>
                <Column5 title='Created'>
                    <Div39>{appearances['Sum'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#5f6368"><path d="M453-280h60v-166h167v-60H513v-174h-60v174H280v60h173v166Zm27.27 200q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg></Div38>
                </Column5>
                <Column5 title='New'>
                    <Div39>{appearances['New'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"/></svg></Div38>
                </Column5>
                <Column5 title='Accepted'>
                    <Div39>{appearances['Accepted'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg></Div38>
                </Column5>
                <Column5 title='Declined'>
                    <Div39>{appearances['Declined'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg></Div38>
                </Column5>
                <Column5 title='Graded'>
                    <Div39>{appearances['Graded'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="M660-120 555-226l43-42 63 63 138-139 43 42-182 182Zm-540 0v-60h360v60H120Zm0-165v-60h360v60H120Zm0-165v-60h720v60H120Zm0-165v-60h720v60H120Zm0-165v-60h720v60H120Z"/></svg></Div38>
                </Column5>
                <Column5 title='progress'>
                    <Div39>{appearances['In progress'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="M430-82q-72-9-134.5-43t-108-86.5Q142-264 116-332.5T90-480q0-88 41.5-168T243-790H121v-60h229v229h-60v-129q-64 51-102 121.5T150-480q0 132 80 225.5T430-143v61Zm-7-228L268-465l42-42 113 113 227-227 42 42-269 269Zm187 200v-229h60v129q64-52 102-122t38-148q0-132-80-225.5T530-817v-61q146 18 243 129t97 269q0 88-41.5 168T717-170h122v60H610Z"/></svg></Div38>
                </Column5>
                <Column5 title='Done'>
                    <Div39>{appearances['Done'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="M294-242 70-466l43-43 181 181 43 43-43 43Zm170 0L240-466l43-43 181 181 384-384 43 43-427 427Zm0-170-43-43 257-257 43 43-257 257Z"/></svg></Div38>
                </Column5>
                <Column5 title='Acrhived'>
                    <Div39>{appearances['Acrhived'] || 0}</Div39>
                    <Div38><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#434343"><path d="m480-270 156-156-40-40-86 86v-201h-60v201l-86-86-40 40 156 156ZM180-674v494h600v-494H180Zm0 554q-24.75 0-42.37-17.63Q120-155.25 120-180v-529q0-9.88 3-19.06 3-9.18 9-16.94l52-71q8-11 20.94-17.5Q217.88-840 232-840h495q14.12 0 27.06 6.5T775-816l53 71q6 7.76 9 16.94 3 9.18 3 19.06v529q0 24.75-17.62 42.37Q804.75-120 780-120H180Zm17-614h565l-36.41-46H233l-36 46Zm283 307Z"/></svg></Div38>
                </Column5>
              </Div33>
              <Div43>
              <Div46>Proposals created for last week:</Div46>
              <LineChart
        xAxis={[
          {
            label: "Date",
            data: xAxisData,
            tickInterval: xAxisData,
            scaleType: "time",
            valueFormatter: (timestamp) => {
              const date = new Date(timestamp);
              return dayjs(date).format("MMM D");
            },
          },
        ]}
        yAxis={[{ label: "Proposals count", 
        style: { marginLeft: '20px' },

      }]}
        series={[
          {label: 'Proposals: ', data: yAxisData },
        ]}
        height={300}
      />
              </Div43>
              <Div45></Div45>
            </Div32>
          </Div25>
        </Column4>
      </Div2>
    </Div>
  );
}

const Div = styled.div`
  background-color: #fff;
  padding: 0 20px 0 50px;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const Div2 = styled.div`
  display: flex;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  margin-top:5%;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const Div3 = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const Div4 = styled.div`
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  padding: 18px 5px 18px 18px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    padding-right: 20px;
  }
`;

const Img = styled.img`
  border-radius: 50%;
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
`;

const Div5 = styled.div`
  align-self: start;  
  display: flex;
  margin-top: 9px;
  flex-grow: 1;
  flex-basis: 0%;
  flex-direction: column;
`;

const Div15 = styled.div`
  margin-left: 15px;
  display: flex;
  align-items: center;
  color: #4a4a4a;
  font: 1000 22px Roboto, sans-serif;
`;

const Div6 = styled.div`
  margin-left: 15px;
  color: #4a4a4a;
  font: 1000 22px Roboto, sans-serif;
`;

const Div7 = styled.div`
  margin-left: 15px;
  color: #868686;
  margin-top: 10px;
  white-space: nowrap;
  font: italic 300 19px Roboto, sans-serif;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Div9 = styled.div`
  margin-top: 56px;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const Div10 = styled.div`
  gap: 20px;
  display: flex;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
`;

const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 70%;
  margin-left: 0px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const Div11 = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  font-size: 18px;
  color: #000;
  font-weight: 300;
  white-space: nowrap;
  text-align: center;
  @media (max-width: 991px) {
    margin-top: 40px;
    white-space: initial;
  }
`;

const Div12 = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;


const Button = styled.button`
  aspect-ratio: 1;
  object-fit: auto;
  border-radius:10%;
  border:none;
  object-position: center;
  width: 120px;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
`;

const Text = styled.div`
  font-family: Roboto, sans-serif;
  margin-top: 19px;
`;



const Div17 = styled.div`
  display: flex;
  margin-top: 35px;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;


const Column4 = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 73%;
  margin-left: 20px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const Div25 = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const Div26 = styled.div`
  align-self: end;
  display: flex;
  width: 833px;
  max-width: 100%;
  justify-content: space-between;
  gap: 20px;
  font-weight: 400;
  white-space: nowrap;
  @media (max-width: 991px) {
    flex-wrap: wrap;
    white-space: initial;
  }
`;

const Div27 = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 30px;
  color: #696969;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const DropdownWrapper = styled.div`
  width: 160px;
  margin-top: 15px;
`;

const Img8 = styled.img`
  aspect-ratio: 1.12;
  object-fit: auto;
  object-position: center;
  width: 53px;
`;

const Div28 = styled.div`
  font-family: Roboto, sans-serif;
  align-self: start;
  margin-top: 20px;
  flex-grow: 1;
`;

const Div29 = styled.div`
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  background-color: #fff;
  align-self: start;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 16px;
  color: #000;
  padding: 8px 13px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const DropdownMenu = styled.div`
  width: 160px;
  position: absolute;
  top: 55px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  border: 1px solid #d7d7d7;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 991px) {
    white-space: initial;
  }
  padding: 8px 12px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const ProfileText = styled.div`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  margin: auto 0;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const LogoutText = styled.div`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  margin: auto 0;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Div30 = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const RightMenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const ProfileName = styled.div`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  margin: auto 0;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Div32 = styled.div`
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  margin-top: 15px;
  flex-direction: column;
  padding: 30px 18px 0 18px;
  @media (max-width: 991px) {
    max-width: 100%;
    padding-right: 20px;
  }
`;

const Div33 = styled.div`
  display: flex;
  margin-top: 40px;
  justify-content: space-around;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    padding-right: 20px;
  }
`;

const Column5 = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  margin-left: 0px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const Div36 = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  font-size: 16px;
  color: #484848;
  font-weight: 500;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const Div37 = styled.div`
  display: flex;
  justify-content: center;
  font: 500 32px Roboto, sans-serif;
  white-space: pre;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Div38 = styled.div`
  display: flex;
  justify-content: center;
  font: 600 16px Roboto, sans-serif;
  font-family: Roboto, sans-serif;
  margin-top: 15px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const Div39 = styled.div`
  display: flex;
  justify-content: center;
  font: 400 32px Roboto, sans-serif;
`;

const EditButton = styled.button`
  display: inline-block;
  margin-bottom: 15px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;





const Div43 = styled.div`
  flex-direction: column;
  @media (max-width: 991px) {
  }
`;

const Div45 = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 21px;
  font: 400 32px Roboto, sans-serif;
`;

const Div46 = styled.div`
  color: #484848;
  margin-top: 50px;
  margin-bottom: 20px;
  margin-left: 25px;
  font: 600 16px Roboto, sans-serif;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

export default ProposerMainPage;