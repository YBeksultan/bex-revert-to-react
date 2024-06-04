import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Logo from '../../images/User-512.webp';
import { Link } from 'react-router-dom';
import { getImageById, fetchUserData, fetchProposalsByID, fetchProposersData, getProposerById, fetchProposalData } from "../../services/apiService";
import { ContributionCalendar, createTheme } from "react-contribution-calendar";
import Spinner from '../spinner/spinner';
import Select from 'react-select';
import { useParams } from 'react-router-dom';


export const logOut = () => {
  localStorage.removeItem('accessToken');
  window.location.href = "../login";
};



const customTheme = createTheme({
  level0: '#d0e1eb',
  level1: '#b6ddf4',
  level2: '#74a0ca',
  level3: '#0161a6',
  level4: '#154373',
});

const years = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' }
]


const data = [
  {
    id: 1,
    name: "Adil Sissenov",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/c2a3a5c7a159d00f3f76413741945156f0dbc1cf972b7d109ae5a439fb4fafe9?apiKey=76bc4e76ba824cf091e9566ff1ae9339&",
    awards: [
      { id: 1, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/219d0239c213b406c20cf50b504208c4f7a16c3d5b20364f128e47f3dc5552a1?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" },
      { id: 2, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/2288abf5fb06b34a2001bee518e5d8f6b1dd83efec16ead3e887fd58ee253be9?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" },
    ],
  },
];




function Header() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { profileId } = useParams();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [proposalsDataById, setProposalsData] = useState(null);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const fetchData = async () => {
    try {

      const urlSegments = window.location.pathname.split('/');
      const id = urlSegments[urlSegments.length - 1];

      const proposersData = await fetchProposersData();
      const profileDataResponse = await getProposerById(id);
      const userDataResponse = await fetchUserData();
      const proposalsDataByIdResponse = await fetchProposalsByID(id);
      
      console.log(proposalsDataByIdResponse)
      const transformedData = {};
      proposersData.forEach((item) => {
        transformedData[item.id] = item;
      });

      if(userDataResponse.is_proposer && userDataResponse.proposer.id === parseInt(profileId)){
        setIsOwner(true);
      }

      if (proposalsDataByIdResponse) {
        setProposalsData(proposalsDataByIdResponse);
      }

      if (profileDataResponse) {
        setProfileData(profileDataResponse);
      }
      if (userDataResponse) {
        if(userDataResponse.avatar){
          const imageResponse = await getImageById(userDataResponse.avatar);
          setImageSrc(imageResponse.image);
        }
        setUserData(userDataResponse);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const countProposalsByDate = () => {
    const countByDate = {};
    proposalsDataById.forEach(proposal => {
      const date = new Date(proposal.accepted_at);
      date.setDate(date.getDate()); // Adding 1 day
      const isoDate = date.toISOString().split('T')[0];
      countByDate[isoDate] = (countByDate[isoDate] || 0) + 1;
    });
    return countByDate;
  };

  const generateCalendarData = () => {
    const countByDate = countProposalsByDate();
    const calendarData = [];
    for (const date in countByDate) {
      const level = Math.min(countByDate[date], 4);
      const dataEntry = {
        [date]: {
          level: level
        }
      };
      calendarData.push(dataEntry);
    }
    return calendarData;
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  };

  const calendarData = generateCalendarData();

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption.value);
  };

  const getLastCreatedProposal = () => {
    if (!proposalsDataById || proposalsDataById.length === 0) {
      return null;
    }
    const sortedProposals = proposalsDataById.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return sortedProposals[0];
  };

  const lastCreatedProposal = getLastCreatedProposal();

  let sumNew = 0;
  let sumAccepted = 0;
  let sumDeclined = 0;
  let sumArchived = 0;

  proposalsDataById.forEach(data => {
    switch (data.status) {
      case 'New':
        sumNew++;
        break;
      case 'Accepted':
        sumAccepted++;
        break;
      case 'Declined':
        sumDeclined++;
        break;
      case 'Archived':
        sumArchived++;
        break;
      default:
    }
  });

  return (
    <Container>
      <Main>
        <Div3>
        <Link to={"/main"}>
          <LogoKaizen src="https://cdn.builder.io/api/v1/image/assets/TEMP/3905e52e9c6b961ec6717c80409232f3222eab9fc52b8caf2e55d314ff83b93e?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="KaizenCloud Logo" />
          </Link>
          <Link to="/slider" style={{ textDecoration: 'none', marginTop: 57}}>
            <Button
              loading="lazy"
            ><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16667 13.3333C3.93056 13.3333 3.73264 13.2535 3.57292 13.0937C3.41319 12.934 3.33333 12.7361 3.33333 12.5V10.8333H14.1667V3.33333H15.8333C16.0694 3.33333 16.2674 3.41319 16.4271 3.57292C16.5868 3.73264 16.6667 3.93056 16.6667 4.16667V16.6667L13.3333 13.3333H4.16667ZM0 12.5V0.833333C0 0.597222 0.0798611 0.399306 0.239583 0.239583C0.399306 0.0798611 0.597222 0 0.833333 0H11.6667C11.9028 0 12.1007 0.0798611 12.2604 0.239583C12.4201 0.399306 12.5 0.597222 12.5 0.833333V8.33333C12.5 8.56944 12.4201 8.76736 12.2604 8.92708C12.1007 9.08681 11.9028 9.16667 11.6667 9.16667H3.33333L0 12.5ZM10.8333 7.5V1.66667H1.66667V7.5H10.8333Z" fill="#7D7D7D" />
              </svg>

            </Button>
          </Link>
          <Link to="/grading" style={{ textDecoration: 'none' }}>
            <Button1
              loading="lazy"
            ><svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.39333 13.0044L9.33333 11.3377L12.2733 13.0263L11.5033 9.86842L14.0933 7.76316L10.6867 7.47807L9.33333 4.49561L7.98 7.45614L4.57333 7.74123L7.16333 9.86842L6.39333 13.0044ZM3.57 16.6667L5.08667 10.5044L0 6.35965L6.72 5.8114L9.33333 0L11.9467 5.8114L18.6667 6.35965L13.58 10.5044L15.0967 16.6667L9.33333 13.3991L3.57 16.6667Z" fill="#7D7D7D" />
              </svg>
            </Button1>
          </Link>
          <Link to="/after_grading" style={{ textDecoration: 'none' }}>
            <Button2
              loading="lazy"
            ><svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.6189 5.87494C9.6189 5.5033 9.92017 5.20203 10.2918 5.20203H16.6251C16.9968 5.20203 17.2981 5.5033 17.2981 5.87494C17.2981 6.24658 16.9968 6.54786 16.6251 6.54786H10.2918C9.92017 6.54786 9.6189 6.24658 9.6189 5.87494Z" fill="#7D7D7D" />
                <path fillRule="evenodd" clipRule="evenodd" d="M1.70215 12.9999C1.70215 12.6283 2.00342 12.327 2.37507 12.327H8.7084C9.08004 12.327 9.38132 12.6283 9.38132 12.9999C9.38132 13.3716 9.08004 13.6729 8.7084 13.6729H2.37507C2.00342 13.6729 1.70215 13.3716 1.70215 12.9999Z" fill="#7D7D7D" />
                <path d="M7.125 5.875C7.125 7.18668 6.06168 8.25 4.75 8.25C3.43832 8.25 2.375 7.18668 2.375 5.875C2.375 4.56332 3.43832 3.5 4.75 3.5C6.06168 3.5 7.125 4.56332 7.125 5.875Z" fill="#7D7D7D" />
                <path d="M16.625 13C16.625 14.3117 15.5617 15.375 14.25 15.375C12.9383 15.375 11.875 14.3117 11.875 13C11.875 11.6883 12.9383 10.625 14.25 10.625C15.5617 10.625 16.625 11.6883 16.625 13Z" fill="#7D7D7D" />
              </svg>
            </Button2>
          </Link>
          <Link to="/proposals" style={{ textDecoration: 'none' }}>
            <Button3
              loading="lazy"
            ><svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.66667 16.394C1.20833 16.394 0.815972 16.2367 0.489583 15.9222C0.163194 15.6077 0 15.2296 0 14.7879V3.5455C0 3.10383 0.163194 2.72574 0.489583 2.41121C0.815972 2.09669 1.20833 1.93943 1.66667 1.93943H5.16667C5.34722 1.45762 5.64931 1.06949 6.07292 0.775041C6.49653 0.480596 6.97222 0.333374 7.5 0.333374C8.02778 0.333374 8.50347 0.480596 8.92708 0.775041C9.35069 1.06949 9.65278 1.45762 9.83333 1.93943H13.3333C13.7917 1.93943 14.184 2.09669 14.5104 2.41121C14.8368 2.72574 15 3.10383 15 3.5455V8.9258C14.7361 8.80534 14.4653 8.70162 14.1875 8.61462C13.9097 8.52763 13.625 8.46406 13.3333 8.4239V3.5455H1.66667V14.7879H6.70833C6.75 15.0824 6.81597 15.3634 6.90625 15.6311C6.99653 15.8988 7.10417 16.1531 7.22917 16.394H1.66667ZM1.66667 13.9849V14.7879V3.5455V8.4239V8.36368V13.9849ZM3.33333 13.1819H6.72917C6.77083 12.9008 6.83681 12.6264 6.92708 12.3588C7.01736 12.0911 7.11806 11.8301 7.22917 11.5758H3.33333V13.1819ZM3.33333 9.96974H8.41667C8.86111 9.56822 9.35764 9.23363 9.90625 8.96595C10.4549 8.69827 11.0417 8.51759 11.6667 8.4239V8.36368H3.33333V9.96974ZM3.33333 6.75762H11.6667V5.15156H3.33333V6.75762ZM7.5 2.94322C7.68055 2.94322 7.82986 2.88634 7.94792 2.77258C8.06597 2.65882 8.125 2.51494 8.125 2.34095C8.125 2.16696 8.06597 2.02308 7.94792 1.90932C7.82986 1.79556 7.68055 1.73868 7.5 1.73868C7.31944 1.73868 7.17014 1.79556 7.05208 1.90932C6.93403 2.02308 6.875 2.16696 6.875 2.34095C6.875 2.51494 6.93403 2.65882 7.05208 2.77258C7.17014 2.88634 7.31944 2.94322 7.5 2.94322ZM12.5 18C11.3472 18 10.3646 17.6086 9.55208 16.8256C8.73958 16.0427 8.33333 15.0957 8.33333 13.9849C8.33333 12.874 8.73958 11.9271 9.55208 11.1442C10.3646 10.3612 11.3472 9.96974 12.5 9.96974C13.6528 9.96974 14.6354 10.3612 15.4479 11.1442C16.2604 11.9271 16.6667 12.874 16.6667 13.9849C16.6667 15.0957 16.2604 16.0427 15.4479 16.8256C14.6354 17.6086 13.6528 18 12.5 18ZM12.0833 16.394H12.9167V14.3864H15V13.5834H12.9167V11.5758H12.0833V13.5834H10V14.3864H12.0833V16.394Z" fill="#7D7D7D" />
              </svg>
            </Button3>
          </Link>
          <Link to="/assigned" style={{ textDecoration: 'none' }}>
            <Button4
              loading="lazy"
            ><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75556 13.3778L13.0222 7.11111L11.7778 5.86667L6.75556 10.8889L4.22222 8.35556L2.97778 9.6L6.75556 13.3778ZM1.77778 17.7778C1.28889 17.7778 0.87037 17.6037 0.522222 17.2556C0.174074 16.9074 0 16.4889 0 16V3.55556C0 3.06667 0.174074 2.64815 0.522222 2.3C0.87037 1.95185 1.28889 1.77778 1.77778 1.77778H5.51111C5.7037 1.24444 6.02593 0.814815 6.47778 0.488889C6.92963 0.162963 7.43704 0 8 0C8.56296 0 9.07037 0.162963 9.52222 0.488889C9.97407 0.814815 10.2963 1.24444 10.4889 1.77778H14.2222C14.7111 1.77778 15.1296 1.95185 15.4778 2.3C15.8259 2.64815 16 3.06667 16 3.55556V16C16 16.4889 15.8259 16.9074 15.4778 17.2556C15.1296 17.6037 14.7111 17.7778 14.2222 17.7778H1.77778ZM1.77778 16H14.2222V3.55556H1.77778V16ZM8 2.88889C8.19259 2.88889 8.35185 2.82593 8.47778 2.7C8.6037 2.57407 8.66667 2.41481 8.66667 2.22222C8.66667 2.02963 8.6037 1.87037 8.47778 1.74444C8.35185 1.61852 8.19259 1.55556 8 1.55556C7.80741 1.55556 7.64815 1.61852 7.52222 1.74444C7.3963 1.87037 7.33333 2.02963 7.33333 2.22222C7.33333 2.41481 7.3963 2.57407 7.52222 2.7C7.64815 2.82593 7.80741 2.88889 8 2.88889Z" fill="#7D7D7D" />
              </svg>
            </Button4>
          </Link>
          <Link to="/proposers" style={{ textDecoration: 'none' }}>
            <Button5
              loading="lazy"
            ><svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.1665 9.50004C12.5832 9.50004 12.0901 9.29865 11.6873 8.89587C11.2846 8.4931 11.0832 8.00004 11.0832 7.41671C11.0832 6.83337 11.2846 6.34032 11.6873 5.93754C12.0901 5.53476 12.5832 5.33337 13.1665 5.33337C13.7498 5.33337 14.2429 5.53476 14.6457 5.93754C15.0484 6.34032 15.2498 6.83337 15.2498 7.41671C15.2498 8.00004 15.0484 8.4931 14.6457 8.89587C14.2429 9.29865 13.7498 9.50004 13.1665 9.50004ZM8.99984 13.6667V12.5C8.99984 12.1667 9.08664 11.8577 9.26025 11.573C9.43386 11.2882 9.68039 11.0834 9.99984 10.9584C10.4998 10.75 11.0172 10.5938 11.5519 10.4896C12.0866 10.3855 12.6248 10.3334 13.1665 10.3334C13.7082 10.3334 14.2464 10.3855 14.7811 10.4896C15.3158 10.5938 15.8332 10.75 16.3332 10.9584C16.6526 11.0834 16.8991 11.2882 17.0728 11.573C17.2464 11.8577 17.3332 12.1667 17.3332 12.5V13.6667H8.99984ZM7.33317 7.00004C6.4165 7.00004 5.63178 6.67365 4.979 6.02087C4.32623 5.3681 3.99984 4.58337 3.99984 3.66671C3.99984 2.75004 4.32623 1.96532 4.979 1.31254C5.63178 0.659763 6.4165 0.333374 7.33317 0.333374C8.24984 0.333374 9.03456 0.659763 9.68734 1.31254C10.3401 1.96532 10.6665 2.75004 10.6665 3.66671C10.6665 4.58337 10.3401 5.3681 9.68734 6.02087C9.03456 6.67365 8.24984 7.00004 7.33317 7.00004ZM0.666504 13.6667V11.3334C0.666504 10.8612 0.784559 10.4271 1.02067 10.0313C1.25678 9.63546 1.58317 9.33337 1.99984 9.12504C2.83317 8.70837 3.69775 8.38893 4.59359 8.16671C5.48942 7.94448 6.40261 7.83337 7.33317 7.83337C7.81928 7.83337 8.30539 7.87504 8.7915 7.95837C9.27761 8.04171 9.76373 8.13893 10.2498 8.25004L9.5415 8.95837L8.83317 9.66671C8.58317 9.59726 8.33317 9.55212 8.08317 9.53129C7.83317 9.51046 7.58317 9.50004 7.33317 9.50004C6.52761 9.50004 5.73942 9.59726 4.96859 9.79171C4.19775 9.98615 3.45817 10.2639 2.74984 10.625C2.61095 10.6945 2.50678 10.7917 2.43734 10.9167C2.36789 11.0417 2.33317 11.1806 2.33317 11.3334V12H7.33317V13.6667H0.666504ZM7.33317 5.33337C7.7915 5.33337 8.18386 5.17018 8.51025 4.84379C8.83664 4.5174 8.99984 4.12504 8.99984 3.66671C8.99984 3.20837 8.83664 2.81601 8.51025 2.48962C8.18386 2.16324 7.7915 2.00004 7.33317 2.00004C6.87484 2.00004 6.48248 2.16324 6.15609 2.48962C5.8297 2.81601 5.6665 3.20837 5.6665 3.66671C5.6665 4.12504 5.8297 4.5174 6.15609 4.84379C6.48248 5.17018 6.87484 5.33337 7.33317 5.33337Z" fill="#7D7D7D" />
              </svg>
            </Button5>
          </Link>
        </Div3>

        <ProfileWrapper>
          <Div5>
            <Div6>Company name</Div6>
            <EditAndDropdown>
              {isOwner && (
                <Link to='/edit_profile'>
                <EditButton>
                <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8967 13.1938C11.1234 13.1938 9.60537 12.5624 8.34257 11.2996C7.07976 10.0368 6.44836 8.51878 6.44836 6.74548C6.44836 4.97218 7.07976 3.45413 8.34257 2.19133C9.60537 0.928521 11.1234 0.297119 12.8967 0.297119C14.67 0.297119 16.1881 0.928521 17.4509 2.19133C18.7137 3.45413 19.3451 4.97218 19.3451 6.74548C19.3451 8.51878 18.7137 10.0368 17.4509 11.2996C16.1881 12.5624 14.67 13.1938 12.8967 13.1938ZM0 26.0906V21.5767C0 20.6901 0.22838 19.8572 0.685139 19.078C1.1419 18.2988 1.7733 17.7077 2.57934 17.3047C3.94962 16.6061 5.49454 16.015 7.21411 15.5314C8.93367 15.0477 10.8279 14.8059 12.8967 14.8059H13.461C13.6222 14.8059 13.7834 14.8328 13.9446 14.8865C13.7296 15.3702 13.5483 15.8739 13.4005 16.3979C13.2527 16.9218 13.1385 17.4659 13.0579 18.0301H12.8967C10.9891 18.0301 9.27624 18.2719 7.75819 18.7556C6.24013 19.2392 4.99748 19.7228 4.03023 20.2064C3.78841 20.3408 3.59362 20.5289 3.44584 20.7707C3.29807 21.0125 3.22418 21.2812 3.22418 21.5767V22.8664H13.3804C13.5416 23.4306 13.7565 23.9881 14.0252 24.5389C14.2939 25.0897 14.5894 25.6069 14.9118 26.0906H0ZM22.5693 27.7027L22.0856 25.2845C21.7632 25.1502 21.461 25.0091 21.1788 24.8614C20.8967 24.7136 20.6079 24.5322 20.3123 24.3173L17.9748 25.0427L16.3627 22.3022L18.2166 20.6901C18.1629 20.3139 18.136 19.9646 18.136 19.6422C18.136 19.3198 18.1629 18.9705 18.2166 18.5943L16.3627 16.9823L17.9748 14.2417L20.3123 14.9671C20.6079 14.7522 20.8967 14.5708 21.1788 14.4231C21.461 14.2753 21.7632 14.1342 22.0856 13.9999L22.5693 11.5818H25.7934L26.2771 13.9999C26.5995 14.1342 26.9018 14.282 27.1839 14.4432C27.466 14.6044 27.7548 14.8059 28.0504 15.0477L30.3879 14.2417L32 17.0629L30.1461 18.675C30.1998 18.9974 30.2267 19.3332 30.2267 19.6825C30.2267 20.0318 30.1998 20.3676 30.1461 20.6901L32 22.3022L30.3879 25.0427L28.0504 24.3173C27.7548 24.5322 27.466 24.7136 27.1839 24.8614C26.9018 25.0091 26.5995 25.1502 26.2771 25.2845L25.7934 27.7027H22.5693ZM24.1814 22.8664C25.068 22.8664 25.827 22.5507 26.4584 21.9193C27.0898 21.2879 27.4055 20.5289 27.4055 19.6422C27.4055 18.7556 27.0898 17.9965 26.4584 17.3651C25.827 16.7337 25.068 16.418 24.1814 16.418C23.2947 16.418 22.5357 16.7337 21.9043 17.3651C21.2729 17.9965 20.9572 18.7556 20.9572 19.6422C20.9572 20.5289 21.2729 21.2879 21.9043 21.9193C22.5357 22.5507 23.2947 22.8664 24.1814 22.8664ZM12.8967 9.96966C13.7834 9.96966 14.5424 9.65396 15.1738 9.02256C15.8052 8.39116 16.1209 7.63213 16.1209 6.74548C16.1209 5.85883 15.8052 5.09981 15.1738 4.4684C14.5424 3.837 13.7834 3.5213 12.8967 3.5213C12.0101 3.5213 11.251 3.837 10.6196 4.4684C9.98825 5.09981 9.67254 5.85883 9.67254 6.74548C9.67254 7.63213 9.98825 8.39116 10.6196 9.02256C11.251 9.65396 12.0101 9.96966 12.8967 9.96966Z" fill="#939393"/>
                </svg>
                </EditButton>
                </Link>
              )}
              <DropdownWrapper onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
            <Div7>
              <Div8>
                <Img8
                  loading="lazy"
                  srcSet={imageSrc || Logo}
                  alt="Person Image"
                  width="24"
                  height="24"
                />
                <Div9>{userData.first_name}</Div9>
              </Div8>
            </Div7>
            {isHovered && (    
                <DropdownMenu>
                  <Link to={`/profile/${userData.proposer.id}`} style={{textDecoration: 'none', color: '#333'}}> 
                  <DropdownItem>
                  <Div8>
                  <Div9>Profile</Div9>
              </Div8>
              <Img9
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/86686b16897beeac74304533d5bb958a4d1e0106aa55fd71c28f706a5b838225?apiKey=76bc4e76ba824cf091e9566ff1ae9339&"
                onClick={logOut}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 6.5C5.60625 6.5 4.84115 6.18177 4.20469 5.54531C3.56823 4.90885 3.25 4.14375 3.25 3.25C3.25 2.35625 3.56823 1.59115 4.20469 0.954687C4.84115 0.318229 5.60625 0 6.5 0C7.39375 0 8.15885 0.318229 8.79531 0.954687C9.43177 1.59115 9.75 2.35625 9.75 3.25C9.75 4.14375 9.43177 4.90885 8.79531 5.54531C8.15885 6.18177 7.39375 6.5 6.5 6.5ZM0 13V10.725C0 10.2646 0.11849 9.84141 0.355469 9.45547C0.592448 9.06953 0.907292 8.775 1.3 8.57187C2.13958 8.15208 2.99271 7.83724 3.85937 7.62734C4.72604 7.41745 5.60625 7.3125 6.5 7.3125C7.39375 7.3125 8.27396 7.41745 9.14062 7.62734C10.0073 7.83724 10.8604 8.15208 11.7 8.57187C12.0927 8.775 12.4076 9.06953 12.6445 9.45547C12.8815 9.84141 13 10.2646 13 10.725V13H0ZM1.625 11.375H11.375V10.725C11.375 10.576 11.3378 10.4406 11.2633 10.3187C11.1888 10.1969 11.0906 10.1021 10.9688 10.0344C10.2375 9.66875 9.49948 9.39453 8.75469 9.21172C8.0099 9.02891 7.25833 8.9375 6.5 8.9375C5.74167 8.9375 4.9901 9.02891 4.24531 9.21172C3.50052 9.39453 2.7625 9.66875 2.03125 10.0344C1.90937 10.1021 1.8112 10.1969 1.73672 10.3187C1.66224 10.4406 1.625 10.576 1.625 10.725V11.375ZM6.5 4.875C6.94687 4.875 7.32943 4.71589 7.64766 4.39766C7.96589 4.07943 8.125 3.69687 8.125 3.25C8.125 2.80312 7.96589 2.42057 7.64766 2.10234C7.32943 1.78411 6.94687 1.625 6.5 1.625C6.05312 1.625 5.67057 1.78411 5.35234 2.10234C5.03411 2.42057 4.875 2.80312 4.875 3.25C4.875 3.69687 5.03411 4.07943 5.35234 4.39766C5.67057 4.71589 6.05312 4.875 6.5 4.875Z" fill="#C4C4C4"/>
                </svg>
              </Img9>
                  </DropdownItem>
                  </Link>
                  <DropdownItem onClick={logOut}>
                  <Div8>
                <Div9>Logout</Div9>
              </Div8>
              <Img9
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/86686b16897beeac74304533d5bb958a4d1e0106aa55fd71c28f706a5b838225?apiKey=76bc4e76ba824cf091e9566ff1ae9339&">
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0037 4.25V2.625C10.0037 2.19402 9.83123 1.7807 9.52423 1.47595C9.21722 1.1712 8.80084 1 8.36667 1H2.63704C2.20287 1 1.78648 1.1712 1.47948 1.47595C1.17247 1.7807 1 2.19402 1 2.625V12.375C1 12.806 1.17247 13.2193 1.47948 13.524C1.78648 13.8288 2.20287 14 2.63704 14H8.36667C8.80084 14 9.21722 13.8288 9.52423 13.524C9.83123 13.2193 10.0037 12.806 10.0037 12.375V10.75" stroke="#C4C4C4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.27408 7.5H15.7333L13.2778 5.0625M13.2778 9.9375L15.7333 7.5" stroke="#C4C4C4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Img9>
                  </DropdownItem>
                  </DropdownMenu>   
                      )}
            </DropdownWrapper>  
            </EditAndDropdown>
               
          </Div5>
          <ProfileContent>

            <ProfileColumn>

              <ProfileInfo>
                <ProposerProfile>
                  <ProposerTitle>{profileData.user.first_name}'s profile</ProposerTitle>
                  <ProposerImage  src={imageSrc || Logo } alt="Proposer" />
                  <ProposerName>{profileData.user.last_name} {profileData.user.first_name}</ProposerName>
                </ProposerProfile>
                <Divider />
                <ProposerStats>
                  <StatIcons>
                    <StatIcon src="https://cdn.builder.io/api/v1/image/assets/TEMP/48f02eb6f2e80808819e0fff01696b38bef5f88910e8b2bccfd10f5ab061d718?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Stat 1" />
                    <StatIcon src="https://cdn.builder.io/api/v1/image/assets/TEMP/f5d6927b0edbfdd58a5aee8b073eb73f97b0b77500c82cba1f16c962ba60a808?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Stat 2" />
                    <StatIcon src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0c1ca8636cd7411382d0f5e42d8c0ee10d3036aded511b137f01153e5b08d8f?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Stat 3" />
                    <StatIcon src="https://cdn.builder.io/api/v1/image/assets/TEMP/e612e4df7331a1a77a9321ec00348235972053f7f1d63da36fc207c8b095475d?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Stat 4" />
                  </StatIcons>
                  <StatValues>
                    <StatValue>{sumNew}</StatValue>
                    <StatValue>{sumAccepted}</StatValue>
                    <StatValue>{sumDeclined}</StatValue>
                    <StatValue>{sumArchived}</StatValue>
                  </StatValues>
                  <AwardsSection>
                    <VerticalDivider />
                    <AwardsTitle>Awards</AwardsTitle>
                  </AwardsSection>
                  <AwardsIcons>
                    {data[0].awards.map((award) => (
                      <AwardIcon key={award.id} src={award.image} alt={`Award ${award.id}`} />
                    ))}
                  </AwardsIcons>
                </ProposerStats>
              </ProfileInfo>
            </ProfileColumn>
            <MainVerticalDivider />
            <GraphColumn>
          
              <LastProposalsGraph>
                <GraphTitle>
               
                  <VerticalDivider />
                  
                  <GraphTitleText>Last proposals graph</GraphTitleText>
                  <Select options={years} onChange={handleYearChange} value={{ value: selectedYear, label: selectedYear }} />
                </GraphTitle>
                <GraphContent>
                </GraphContent>
                <ContributionCalendar 
        start={`${selectedYear}-01-01`}
        end={`${selectedYear}-12-31`}
        daysOfTheWeek={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        includeBoundary={true}
        startsOnSunday={true}
        theme={customTheme}
        cx={12}
        data={calendarData}
        cy={12}
        onCellClick={(_, data) => console.log(data)}
        scroll={false}
      />
              </LastProposalsGraph>
              <Divider style={{marginTop: 65}} />
              <LastProposalsJournal>
                <JournalTitle>
                  <VerticalDivider />
                  <JournalTitleText>Last proposals journal</JournalTitleText>
                </JournalTitle>
                <JournalContent>
                  <JournalText>
                  <JournalDescription>
  {lastCreatedProposal && lastCreatedProposal.text}
</JournalDescription>
<JournalDate>
  {lastCreatedProposal && formatDate(lastCreatedProposal.created_at)}
</JournalDate>
                  </JournalText>
                  <JournalIcon>
                    <JournalIconImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/59ec102d7837fee5a2a5c1e6f1168c560a21aaa8d15f67d9d81cdc7e11cc3173?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Journal Icon" />
                    <JournalIconBackground />
                  </JournalIcon>
                </JournalContent>
              </LastProposalsJournal>
            </GraphColumn>
          </ProfileContent>
        </ProfileWrapper>

      </Main>
    </Container>
  );
}

const HeaderWrapper = styled.header`
  display: flex;
  width: 100%;
  gap: 20px;
  font-size: 16px;
  font-weight: 400;
  justify-content: space-between;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;

const Div3 = styled.div`
  position: fixed;
  z-index: 1;
  height: 100%;
  align-items: center;
  background-color: #fff;
  display: flex;
  flex-basis: 0%;
  flex-direction: column;
  padding: 42px 5px;
  @media (max-width: 991px) {
    display: none;
  }
`;


const Container = styled.div`
`;

const JournalText = styled.div`
  width: 90%;

`;
const JournalDescription = styled.div`
overflow-x: hidden;
overflow-y: auto;
max-height: 75px;
`;

const JournalDate = styled.div`
display: flex;
margin-top: 5%;
margin-left: 70%;
`;

const JournalIcon = styled.div`
`;

const JournalIconImage = styled.div`
`;

const JournalIconBackground = styled.div`
`;



const Div5 = styled.div`
  display: flex;
  width: 100%;
  align-items: start;
  justify-content: space-between;
  gap: 20px;
  font-size: 16px;
  color: #5d5d5d;
  font-weight: 400;
  white-space: nowrap;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    white-space: initial;
  }
`;
const Div6 = styled.div`
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  background-color: #fff;
  justify-content: center;
  padding: 13px 49px;
  @media (max-width: 991px) {
    white-space: initial;
    padding: 0 20px;
  }
`;
const EditAndDropdown = styled.div`
  display: flex;
`;
const EditButton = styled.div`
  cursor: pointer;
  margin-right: 16px; 
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  background-color: #fff;
`;
const DropdownWrapper = styled.div`
  width: 160px;
`;
const Div7 = styled.div`
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 13px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Div8 = styled.div`
  cursro: pointer;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Img8 = styled.img`
  border-radius: 50%;
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 24px;
`;
const Div9 = styled.div`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  margin: auto 0;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const DropdownMenu = styled.div`
  width: 160px;
  position: absolute;
  top: 45px;
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

const Img9 = styled.button`
aspect-ratio: 1.15;
object-fit: auto;
object-position: center;
width: 15px;

cursor:pointer;
background: transparent;
border: none !important;
font-size:0;
margin: auto 0;
`;

const Button = styled.button`
  aspect-ratio: 1;
  border:none;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;
const Button1 = styled.button`
  border:none;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button2 = styled.button`
  border:none;
  aspect-ratio: 1;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button3 = styled.button`
  border:none;
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button4 = styled.button`
  aspect-ratio: 1;
  border:none;
  
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button5 = styled.button`
  aspect-ratio: 1;
  border:none;
  
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 10px;
`;
const Button6 = styled.button`
  aspect-ratio: 1;
  border:none;
  
  &:hover {
    transform: translateY(-5px);
    color: #333;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    background-color:#ECF3FF;
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
}
  object-fit: auto;
  object-position: center;
  width: 40px;
  margin-top: 370px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const LogoKaizen = styled.img`
  aspect-ratio: 1.12;
  object-fit: contain;
  object-position: center;
  width: 43px;
`;

const Main = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  font-size: 16px;
  font-weight: 400;
  background-color: #f2f2f2;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;

const ProfileWrapper = styled.div`
  margin-left: 60px;
  border-radius: 6px;
  width: 95%;
  height: 830px;
  margin-top: 5px;

  @media (max-width: 991px) {
    max-width: 100%;
    padding-right: 20px;
  }
`;

const ProfileContent = styled.div`
margin-top: 20px;

border-radius: 10px;
background-color: #fff;
  display: flex;
  gap: 20px;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
`;

const ProfileColumn = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  margin-left: 0;

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const ProfileInfo = styled.div`
  flex-grow: 1;
  gap: 20px;

  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
    flex-wrap: wrap;
  }
`;

const ProposerProfile = styled.div`
  align-self: start;
  display: flex;
  margin-top: 25px;
  flex-direction: column;
  align-items: start;
  flex-grow: 1;
  flex-basis: 0;
  
  width: 400px;
 
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const ProposerTitle = styled.h2`
  color: #1871ed;
  margin-left: 50px;
  font-family: Roboto, sans-serif;
  justify-content: center;
  font-size: 25px;
  font-weight: 700;
`;

const ProposerImage = styled.img`
  aspect-ratio: 1.02;
  object-fit: cover;
  width: 200px;
  height: 200px;
  margin-left: 50px;
  margin-top: 23px;
`;

const ProposerName = styled.p`
  color: #6e6e6e;
  font-family: Roboto, sans-serif;
  font-size: 25px;
  font-weight: 500;
  align-self: start;
  margin: 20px 0 0 14px;
  margin-left: 60px;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const Divider = styled.div`
  border-color: rgba(211, 211, 211, 1);
  border-style: solid;
  border-width: 1px;
  background-color: #d3d3d3;
  align-self: stretch;
  margin-top: 35px;

  height: 1px;

  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const ProposerStats = styled.div`
  display: flex;
  width: 230px;
  max-width: 100%;
  flex-direction: column;
  margin: 30px 0 0 49px;

  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const StatIcons = styled.div`
  display: flex;
  align-items: start;
  gap: 20px;
  justify-content: space-between;
  padding: 0 1px;
`;

const StatIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 30px;
`;

const StatValues = styled.div`
  display: flex;
  margin-top: 32px;
  font-size: 20px;
  color: #8e8e8e;
  font-weight: 500;
  white-space: nowrap;
  justify-content: space-between;

  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const StatValue = styled.span`
  display: flex;
  justify-content: center;
  width: 30px;
  font-family: Roboto, sans-serif;
`;

const AwardsSection = styled.div`
  display: flex;
  margin-top: 39px;
  gap: 10px;
  font-size: 19px;
  color: #8e8e8e;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const VerticalDivider = styled.div`
  border-color: rgba(132, 167, 217, 1);
  border-style: solid;
  border-width: 1px;
  background-color: #84a7d9;
  width: 1px;
  height: 28px;
`;

const MainVerticalDivider = styled.div`
  border: 1px solid rgba(211, 211, 211, 1);
  background-color: #d3d3d3;
  width: 1px;
  height: 777px;
`;

const AwardsTitle = styled.h3`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  flex-basis: auto;
  margin: auto 0;
`;

const AwardsIcons = styled.div`
  display: flex;
  margin-top: 45px;
  gap: 20px;

  @media (max-width: 991px) {
    padding-right: 20px;
    margin-top: 40px;
  }
`;

const AwardIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 70px;
  align-self: start;
`;

const GraphColumn = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 62%;
  margin-left: 20px;

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const LastProposalsGraph = styled.section`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  margin-top: 85px;
  width: 75%;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;



const GraphTitle = styled.div`
  align-self: start;
  display: flex;
  gap: 10px;
  font-size: 15px;
  color: #8e8e8e;
  font-weight: 500;
`;

const GraphTitleText = styled.h2`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  flex-basis: auto;
  margin: auto 0;
`;



const GraphContent = styled.div`
  display: flex;
  margin-top: 43px;

  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    white-space: initial;
  }
`;


const GraphLegend = styled.div`
  align-self: end;
  display: flex;
  margin-top: 64px;
  gap: 12px;
  font-size: 14px;
  color: #a7a7a7;
  font-weight: 300;
  white-space: nowrap;

  @media (max-width: 991px) {
    margin-top: 40px;
    white-space: initial;
  }
`;

const LegendLabel = styled.span`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
`;

const LegendColors = styled.div`
  display: flex;
  gap: 6px;

  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const LegendColor = styled.div`
  background-color: ${(props) => props.color};
  width: 10px;
  height: 10px;
`;

const LastProposalsJournal = styled.section`
  display: flex;
  flex-direction: column;
`;

const JournalTitle = styled.div`
  align-self: start;
  display: flex;
  margin-top: 36px;
  gap: 10px;
  font-size: 15px;
  color: #8e8e8e;
  font-weight: 500;
`;

const JournalTitleText = styled.h2`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  flex-basis: auto;
  margin: auto 0;
`;

const JournalContent = styled.div`
  display: flex;
  width: 505px;
  max-width: 100%;
  gap: 20px;
  color: #666666;
  font-size: 13px;
  font-family: Roboto, sans-serif;
  margin: 28px 0 0 23px;
  
  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;



export default Header;