import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Spinner from '../spinner/spinner';
import { addProposal, criterias, fetchUserData, getImageById } from '../../services/apiService';
import Avatar from '../../images/User-512.webp';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../CSS/style.css';

export const logOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  window.location.href = "../login";
};


function AddProposalComponent(props) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalText, setProposalText] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [allCriterias, setAllCriterias] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [checkboxCriteria, setCheckboxCriteria] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  const uncheckAllCheckboxes = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const handleCheckboxChange = (checked, id) => {
    if(!checked && checkboxCriteria.includes(id)){
      const updatedCriterias = checkboxCriteria.filter(item => item !== id);
      setCheckboxCriteria(updatedCriterias);
    }
    else if(checked && !checkboxCriteria.includes(id)){
      const updatedCriterias = [...checkboxCriteria];
      updatedCriterias.push(id);
      setCheckboxCriteria(updatedCriterias);
    }
  };

  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;

  const fetchData = async () => {
    try {
      const userDataResponse = await fetchUserData();
      const criteriasData = await criterias();
      if(userDataResponse.avatar){
            const imageResponse = await getImageById(userDataResponse.avatar);
            setImageSrc(imageResponse.image);
          }
      setAllCriterias(criteriasData);
      setUserData(userDataResponse);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSendProposal = async () => {
    try {
      if(proposalTitle === ''){
        toast('Write a proposal title', {
          duration: 4000,
          position: 'top-center',
        
          style: {},
          className: '',
        
          icon: 'ℹ️',
        
          iconTheme: {
            primary: '#0000FF',
            secondary: '#0000FF',
          },
        
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
        return;
      } else if(proposalText === ''){
        toast('Write a proposal text', {
          duration: 4000,
          position: 'top-center',
        
          style: {},
          className: '',
        
          icon: 'ℹ️',
        
          iconTheme: {
            primary: '#0000FF',
            secondary: '#0000FF',
          },
        
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
        return;
      } else if(checkboxCriteria.length === 0){
        toast('Please select at least 1 criteria', {
          duration: 4000,
          position: 'top-center',
        
          style: {},
          className: '',
        
          icon: 'ℹ️',
        
          iconTheme: {
            primary: '#0000FF',
            secondary: '#0000FF',
          },
        
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
        return;
      }
      const response = await addProposal({
        title: proposalTitle,
        text: proposalText,
        proposer: userData.proposer.id,
        criteria: checkboxCriteria
      });
      console.log('Proposal sent:', response);
      const { email, first_name, last_name } = userData;
      const fullname = `${first_name} ${last_name}`;
      const result = { email, fullname, imageSrc, proposalText};
      // await newProposalEmail(result);
      setProposalTitle('');
      setProposalText('');
      setCheckboxCriteria([]);
      uncheckAllCheckboxes();
      toast.success('Proposal sent successfully!');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  if (loading) {
    return <Spinner />;
  }

  return (
    <>
     <Div>
      <Div2>
      <Div3>
        <Link to={"/main"}>
          <LogoKaizen src="https://cdn.builder.io/api/v1/image/assets/TEMP/3905e52e9c6b961ec6717c80409232f3222eab9fc52b8caf2e55d314ff83b93e?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="KaizenCloud Logo" />
          </Link>
          <Link href="/add_proposal" style={{ textDecoration: 'none', marginTop: 57}}>
            <Button
              loading="lazy"
            > <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2B8DC2"><path d="M723.59-192v-92.41h-92.42v-79.18h92.42V-456h79.17v92.41h92.41v79.18h-92.41V-192h-79.17Zm-552 56.13q-33.79 0-58.39-24.61-24.61-24.61-24.61-58.39v-522.26q0-34.48 24.61-58.74 24.6-24.26 58.39-24.26h522.02q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v216.72h-83v-92.89H171.59v398.43h486v83h-486Zm0-553.43h522.02v-51.83H171.59v51.83Zm0 0v-51.83 51.83Z"/></svg>


            </Button>
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <Button1
              loading="lazy"
            >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7D7D7D"><path d="M480-484.07q-63.59 0-107.86-44.27-44.27-44.27-44.27-107.86 0-63.58 44.27-107.74 44.27-44.15 107.86-44.15 63.59 0 107.86 44.15 44.27 44.16 44.27 107.74 0 63.59-44.27 107.86-44.27 44.27-107.86 44.27ZM183.87-179.8v-104.61q0-25.23 13.74-47.59 13.74-22.37 37.8-37.35 55.72-32.24 117.96-49.48 62.24-17.24 126.42-17.24 64.64 0 127.1 17.12 62.46 17.12 117.7 49.36 24.06 13.95 37.8 36.75 13.74 22.8 13.74 48.41v104.63H183.87Zm83-83h426.26v-20.42q0-4.94-3.02-8.99-3.03-4.04-7.98-6.29-44.56-27.04-95.85-40.8Q535-353.07 480-353.07q-54.52 0-106.28 13.77-51.76 13.76-95.85 40.8-5 3.89-8 7.43-3 3.53-3 7.85v20.42ZM480.2-567.07q28.6 0 48.77-20.36 20.16-20.37 20.16-48.97 0-28.6-20.37-48.64-20.36-20.05-48.96-20.05t-48.77 20.3q-20.16 20.3-20.16 48.81 0 28.6 20.37 48.76 20.36 20.15 48.96 20.15Zm-.2-69.13Zm0 373.4Z"/></svg>
            </Button1>
          </Link>
          <Link to="/assigned" style={{ textDecoration: 'none' }}>
            <Button2
              loading="lazy"
            ><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75556 13.3778L13.0222 7.11111L11.7778 5.86667L6.75556 10.8889L4.22222 8.35556L2.97778 9.6L6.75556 13.3778ZM1.77778 17.7778C1.28889 17.7778 0.87037 17.6037 0.522222 17.2556C0.174074 16.9074 0 16.4889 0 16V3.55556C0 3.06667 0.174074 2.64815 0.522222 2.3C0.87037 1.95185 1.28889 1.77778 1.77778 1.77778H5.51111C5.7037 1.24444 6.02593 0.814815 6.47778 0.488889C6.92963 0.162963 7.43704 0 8 0C8.56296 0 9.07037 0.162963 9.52222 0.488889C9.97407 0.814815 10.2963 1.24444 10.4889 1.77778H14.2222C14.7111 1.77778 15.1296 1.95185 15.4778 2.3C15.8259 2.64815 16 3.06667 16 3.55556V16C16 16.4889 15.8259 16.9074 15.4778 17.2556C15.1296 17.6037 14.7111 17.7778 14.2222 17.7778H1.77778ZM1.77778 16H14.2222V3.55556H1.77778V16ZM8 2.88889C8.19259 2.88889 8.35185 2.82593 8.47778 2.7C8.6037 2.57407 8.66667 2.41481 8.66667 2.22222C8.66667 2.02963 8.6037 1.87037 8.47778 1.74444C8.35185 1.61852 8.19259 1.55556 8 1.55556C7.80741 1.55556 7.64815 1.61852 7.52222 1.74444C7.3963 1.87037 7.33333 2.02963 7.33333 2.22222C7.33333 2.41481 7.3963 2.57407 7.52222 2.7C7.64815 2.82593 7.80741 2.88889 8 2.88889Z" fill="#7D7D7D" />
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
          <Link to="/edit_profile" style={{ textDecoration: 'none' }}>
            <Button4
              loading="lazy"
            ><svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#7D7D7D"><path d="M502.57-262.8Zm-318.7 83v-104.61q0-25.23 13.74-47.59 13.74-22.37 37.8-37.35 55.72-32.24 118.03-49.48 62.31-17.24 126.56-17.24 38.87 0 76.33 6.12 37.46 6.11 73.26 17.36l-67.81 67.57q-20.32-4.76-40.39-6.4-20.07-1.65-41.39-1.65-54.52 0-106.28 13.77-51.76 13.76-95.85 40.8-5 3.89-8 7.43-3 3.53-3 7.85v20.42h235.7v83h-318.7Zm390.7 43.93v-119.7L786-466q7.98-8.17 17.72-11.8 9.75-3.63 19.39-3.63 10.51 0 20.12 3.85 9.6 3.86 17.47 11.58l44 45q7.26 7.98 11.34 17.72 4.09 9.75 4.09 19.39 0 9.95-3.65 19.83-3.66 9.87-11.78 17.76L694.26-135.87H574.57Zm292.78-247.78-45-45 45 45Zm-240 195h45L786.39-302.7l-22-23-22-22-115.04 114.05v45ZM764.39-325.7l-22-22 44 45-22-23ZM480-484.07q-63.59 0-107.86-44.27-44.27-44.27-44.27-107.86 0-63.58 44.27-107.74 44.27-44.15 107.86-44.15 63.59 0 107.86 44.15 44.27 44.16 44.27 107.74 0 63.59-44.27 107.86-44.27 44.27-107.86 44.27Zm.21-83q28.83 0 48.88-20.25 20.04-20.26 20.04-48.97 0-28.71-20.37-48.75-20.36-20.05-48.96-20.05t-48.77 20.3q-20.16 20.3-20.16 48.81 0 28.83 20.26 48.87 20.25 20.04 49.08 20.04ZM480-636.2Z"/></svg>
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
        <Div4>
          <Div5>
            <Div6>Company name</Div6>
            <DropdownWrapper onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
            <Div7>
              <Div8>
                <Img8
                  loading="lazy"
                  srcSet={imageSrc || '/User-512.webp'}
                  alt="Person Image"
                  width="24"
                  height="24"
                />
                <Div9>{userData.first_name}</Div9>
              </Div8>
            </Div7>
            {isHovered && (    
                <DropdownMenu>
                  <Link href={`/profile/${userData.proposer.id}`} style={{textDecoration: 'none', color: '#333'}}> 
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
          </Div5>
          <Div10 className="slider-container">
              <Div11 className="slider">
                <Column></Column>
                <Column style={{position: 'fixed', width: '65%'}}>
                    <Div12>
                        <Div14>{formattedDate}</Div14>
                      <Div22 />
                      <Div23>
                        <ProposalTitle type="text" 
                          placeholder="Title" 
                          value={proposalTitle}
                          onChange={(e) => setProposalTitle(e.target.value)}
                        />
                        <Proposal type="text" 
                          placeholder="Your proposal" 
                          value={proposalText}
                          onChange={(e) => setProposalText(e.target.value)}
                        />
                      </Div23>
                      
                      <ButtonContainer>
                        <SendButton onClick={handleSendProposal}>Send proposal</SendButton>
                        <EraseButton onClick={() => {
                            setProposalText('');
                            setProposalTitle('');
                        }}> Erase All
                        </EraseButton>
                      </ButtonContainer>
                    </Div12>
                </Column>
                <Column2>
                  <>
                    <Div33>
                    <Div37>
                      <Div40>Acceptance criteria</Div40>
                        <Div38>
                          <Div41>Criteria</Div41>
                          <Div41>Description</Div41>
                        </Div38>
                        <Div43 />
                        <CriteriaWrapper>
                        {allCriterias.map((criteria, index) => (
                          <React.Fragment key={index}>
                            <Div44>
                              <Div45>
                                <Checkbox
                                  type="checkbox"
                                  name={criteria.id}
                                  onChange={(event) => handleCheckboxChange(event.target.checked, criteria.id)}
                                  />
                                <Div47>{criteria.name}</Div47>
                              </Div45>
                              <Div48>{criteria.description}</Div48>
                            </Div44>
                            <Div49 />
                          </React.Fragment>
                        ))}
                        </CriteriaWrapper>
                      </Div37>
                    </Div33>
                  </>
                </Column2>
              </Div11>
          </Div10>

        </Div4>
      </Div2>
    </Div> 
    <Toaster />
    </>
  );
}

const CriteriaWrapper = styled.div`
  max-height: 400px;
  overflow: auto;
  @media (max-width: 991px) {
    display: none;
  }

`;

const LogoKaizen = styled.img`
  aspect-ratio: 1.12;
  object-fit: contain;
  object-position: center;
  width: 43px;
`;

const Div = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Div2 = styled.div`
  height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  padding-right: 10px;
  justify-content: space-between;
  gap: 11px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;
const Div3 = styled.div`
  position: fixed;
  height: 100%;
  z-index: 1;
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
const Button = styled.button`
  aspect-ratio: 1;
  border:none;
  background-color:#ECF3FF;
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
  margin-top: 57px;
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
const Div4 = styled.div`
  margin-left: 60px;
  align-self: start;
  display: flex;
  margin-top: 10px;
  flex-grow: 1;
  flex-basis: 0%;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
  }
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
  display: flex;
  justify-content: space-between;
  gap: 10px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Img8 = styled.img`
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
  z-index: 11;
  width: 160px;
  position: absolute;
  top: 50px;
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
const Div10 = styled.div`
  margin-top: 55px;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;
const Div11 = styled.div`
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
  width: 70%;
  margin-left: 0px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;
const Div12 = styled.div`
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 3px 0 22px;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 15px;
  }
`;

const ButtonContainer = styled.div`
  align-self: end;
  display: flex;
  gap: 20px;
  margin: 30px 34px 0 0;

  @media (max-width: 991px) {
    margin: 40px 10px 0 0;
  }
`;

const SendButton = styled.button`
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  background-color: rgba(24, 119, 242, 1);
  color: #fff;
  font-weight: 500;
  justify-content: center;
  padding: 12px 27px;
  border: none;
  cursor: pointer;

  @media (max-width: 991px) {
    padding: 12px 20px;
  }
`;

const EraseButton = styled.button`
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  background-color: rgba(230, 230, 230, 1);
  color: #434343;
  font-weight: 400;
  justify-content: center;
  padding: 13px 46px;
  border: none;
  cursor: pointer;

  @media (max-width: 991px) {
    padding: 13px 20px;
  }
`;
const Div14 = styled.div`
  display: flex;
  height: 35px;
  align-items: center;
  font-family: Roboto, sans-serif;
  margin: 5px 20px;
`;
const Div22 = styled.div`
  background-color: #e6e6e6;
  height: 1px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div23 = styled.div`
  margin: 20px 34px 0 34px;
  z-index:0;
  align-items: start;
  gap: 35px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;
const ProposalTitle = styled.input`
  border:none;
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  background-color: #f2f2f2;
  font-weight: 300;
  padding: 12px;
  margin-bottom: 7px;
  @media (max-width: 991px) {
    max-width: 100%;
    padding-right: 20px;
  }
`;
const Proposal = styled.input`
  border:none;
  width: 100%;
  font-family: Roboto, sans-serif;
  border-radius: 8px;
  background-color: #f2f2f2;
  font-weight: 300;
  padding: 14px 0 70px 10px;
  @media (max-width: 991px) {
    max-width: 100%;
    padding-right: 20px;
  }
`;
const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 30%;
  margin-left: 20px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;
const Div33 = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 15px;
  }
`;
const Div34 = styled.button`
  cursor:pointer;
  border:none;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 15px;
  color: #5d5d5d;
  font-weight: 300;
  white-space: nowrap;
  padding: 20px 27px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    white-space: initial;
    padding: 0 20px;
  }
  &:hover {
    transform: translateY(3px);
    transition: transform 0.5s;
    background-color: #f2f3f4;
    cursor:pointer;
    box-shadow: .0rem .2rem .4rem #777;
    /* line I added */
    pointer-events: visible;
    position: relative;
    z-index: 0;
    visibility: visible;
    float: none;
  }
`;
const Div35 = styled.div`
  border-radius: 8px;
  background-color: #a0a0a0;
  width: 52px;
  height: 52px;
`;
const Div36 = styled.div`
  font-family: Roboto, sans-serif;
  flex-grow: 1;
  display:flex;
  flex-basis: auto;
  margin: auto 0;
`;
const Div37 = styled.div`
  border-radius: 8px;

  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  align-items: center;
  display: flex;
  z-index: 1;
  flex-direction: column;
  padding: 33px 30px;
  @media (max-width: 991px) {
    max-width: 100%;
    padding: 0 20px;
  }
`;
const Div38 = styled.div`
  display: flex;
  margin-left: 41px;
  width: 301px;
  max-width: 100%;
  align-items: flex-start;
  gap: 20px;
  color: #5d5d5d;
  font-weight: 500;
  white-space: nowrap;
  @media (max-width: 991px) {
    margin-left: 10px;
    white-space: initial;
  }
`;
const Div39 = styled.div`
  align-self: start;
  display: flex;
  flex-direction: column;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Div40 = styled.div`
font-family: Roboto, sans-serif;
font-weight: 600;
font-size: 20px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Div41 = styled.div`
  width: 100%;
  margin-top: 37px;
  font-family: Roboto, sans-serif;
  font-weight: 600;
`;
const Div42 = styled.div`
  align-self: end;
  margin-top: 54px;
  font-family: Roboto, sans-serif;
  font-weight: 600;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;
const Div43 = styled.div`
  background-color: #e6e6e6;
  margin-top: 10px;
  height: 1px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;
const Div44 = styled.label`
  display: flex;
  font-weight: 400;
  margin: 14px 0 0 11px;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;
const Div45 = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #5d5d5d;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;
const Checkbox = styled.input`
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  background-color: #fff;

`;
const Div47 = styled.div`
  display: flex;
  font-family: Roboto, sans-serif;
  line-height: 1.5;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1; /* Разрешить сжатие текста */
  word-wrap: break-word; /* Перенос текста на новую строку при необходимости */
  white-space: normal; /* Перенос текста на новую строку */
  overflow: hidden; /* Скрытие излишков текста */
  text-overflow: ellipsis; /* Отображение многоточия для обрезанного текста */
  width: 150px; /* Максимальная ширина для текста */
`;

const Div48 = styled.div`
  color: #7b7b7b;
  flex:start;
  flex-shrink: 1; /* Разрешить сжатие текста */
  font: 12px Roboto, sans-serif;
  overflow: hidden; /* Скрытие излишков текста */
  text-overflow: ellipsis; /* Отображение многоточия для обрезанного текста */
`;

const Div49 = styled.div`
  background-color: #e6e6e6;
  margin-top: 13px;
  height: 1px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
  `

export default AddProposalComponent;