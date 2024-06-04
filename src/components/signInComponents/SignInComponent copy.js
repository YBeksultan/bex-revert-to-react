import React, { useState } from "react";
import styled from "styled-components";
import { login, fetchUserData } from '../../services/apiService';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../CSS/style.css';
import { useNavigate } from 'react-router-dom';


const SignInPage = ({ setUserRole }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/ac879f6dbd5e22e7024a03fa83c96b1953fb078244fa54362febd476fbca7799?apiKey=76bc4e76ba824cf091e9566ff1ae9339&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/ac879f6dbd5e22e7024a03fa83c96b1953fb078244fa54362febd476fbca7799?apiKey=76bc4e76ba824cf091e9566ff1ae9339&",
    "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg"
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      const userDataResponse = await fetchUserData();
      const role = userDataResponse.is_proposer ? 'proposer' : 'not_proposer';
      setUserRole(role);
      navigate("/main");
    } catch (error) {
      alert('Login failed');
      console.error('Login failed:', error);
    }
  };
  return (
    <MainContainer>
      <Header>
        <Logo src="https://cdn.builder.io/api/v1/image/assets/TEMP/3905e52e9c6b961ec6717c80409232f3222eab9fc52b8caf2e55d314ff83b93e?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="KaizenCloud Logo" />
        <BrandName>KaizenCloud</BrandName>
      </Header>
      <ContentWrapper>
      <SignInForm onSubmit={handleSubmit}>
      <Title>Sign in to your account</Title>
      <SubTitle>Welcome back! Select method to sign in:</SubTitle>
      <InputOption>
        <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee4214162733dba192ba3af17c7d29b632759c9375d65612bdc4c45e5f640e30?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Email Icon" />
        <OptionText>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ backgroundColor: 'transparent' }}
            placeholder="Email"
            required
          />
        </OptionText>
      </InputOption>
      <InputOption>
        <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc17cd43c93fe5cd52de4cb4083e202bac1fc58d4dda10fc30e6d313c0287ae3?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" alt="Password Icon" />
        <OptionText>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ backgroundColor: 'transparent' }}
            placeholder="Password"
            required
          />
        </OptionText>
      </InputOption>
      <OptionWrapper>
        <CheckboxWrapper>
          <StyledCheckbox
            id="remember-me"
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="remember-me" style={{ color: '#5D5D5D' }}>
            Remember me
          </label>
        </CheckboxWrapper>
        <ForgotPasswordLink href="#">Forgot your password?</ForgotPasswordLink>
      </OptionWrapper>
      <SignInButton type="submit" style={{padding: 10}}>Sign in</SignInButton>
      <DividerWithText>or</DividerWithText>
      <GoogleSignIn>
        <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/03ec27e4270b25fbe6088125b711ec327e5bbe66af2de7472d8a3fa12ded3285?apiKey=76bc4e76ba824cf091e9566ff1ae9339&" style={{ width: '12%' }} alt="Google Icon" />
        <OptionText>Sign in with Google</OptionText>
      </GoogleSignIn>
      <AccountActions>
        Don’t have an account?{' '}
        <CreateAccountLink href="../registration">Create an account</CreateAccountLink>
      </AccountActions>
    </SignInForm>
        <PromoSection>
        <TransitionGroup style={{textAlign: 'center'}}>
        <CSSTransition key={currentSlide} timeout={500} classNames="slide">
        <PromoImage src={images[currentSlide]} alt="Promo"/>
        </CSSTransition>
        </TransitionGroup>
          <PromoTitle>Find like-minded innovators like you</PromoTitle>
          <PromoText>Share your ideas and promote them together with colleagues.</PromoText>
          <SocialIcons>
          {images.map((_, index) => (
            <SocialIcon key={index} onClick={() => setCurrentSlide(index)} />
          ))}
        </SocialIcons>
        </PromoSection>
      </ContentWrapper>
    </MainContainer>
  );
};

const MainContainer = styled.main`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 90px 50px;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledCheckbox = styled.input`
  appearance: none;
  border: 3px solid #c6c6c6;
  border-radius: 10%;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
  border-color:#2973B9;
  padding: 5px;
  position: relative;
  width: 20px;
  height: 20px;


  &:checked::after {
    content: '✔';
    color: #2973B9;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
  }
`;


const Header = styled.header`
  align-self: start;
  display: flex;
  margin-left: 10px;
  gap: 16px;
  font-size: 20px;
  color: #696969;
  font-weight: 400;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Logo = styled.img`
  aspect-ratio: 1.12;
  object-fit: contain;
  object-position: center;
  width: 43px;
`;

const BrandName = styled.h3`
  font-family: Roboto, sans-serif;
  align-self: start;
  flex-grow: 1;
`;

const ContentWrapper = styled.section`
  align-self: end;
  display: flex;
  width: 1184px;
  max-width: 100%;
  justify-content: space-between;
  gap: 250px;
  margin: 70px 54px 0 0;
  @media (max-width: 991px) {
    flex-wrap: wrap;
    margin: 40px 10px 0 0;
  }
`;

const SignInForm = styled.form`

`;

const Title = styled.h2`
  color: #4a4a4a;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font: 700 25px Roboto, sans-serif;
`;

const SubTitle = styled.p`
  color: #707070;
  margin-top:-10px;
  white-space: nowrap;
  font: 400 19px Roboto, sans-serif;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const InputOption = styled.div`
  border-radius: 6px;
  background-color: #f4faff;
  display: flex;
  &:first-of-type {
    margin-top: 40px;
  }
  &:nth-of-type(2) {
    margin-top: 10px;
  }

  justify-content: space-between;
  gap: 10px;
  font-size: 15px;
  color: #5d5d5d;
  font-weight: 400;
  padding: 10px 11px;
  @media (max-width: 991px) {
    margin-top: 40px;
    white-space: initial;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    font-family: Roboto, sans-serif;
    font-size: 15px;
    padding: 5px;
    ::placeholder {
      color: #5d5d5d; /* Цвет placeholder'а */
    }
  }
`;

const Icon = styled.img`
  object-fit: contain;
  width: 16px;
`;

const OptionText = styled.span`
  flex-grow: 1;
  margin-top: 3px;
`;

const OptionWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  font-size: 14px;
`;

const ForgotPasswordLink = styled.a`
  color: #2b79c2;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  margin-top:1.4%;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const SignInButton = styled.button`
  width: 100%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: #2b79c2;
  margin-top: 30px;
  color: #fff;
  cursor: pointer;
  font: 400 16px Roboto, sans-serif;
  @media (max-width: 991px) {
    margin-top: 40px;
  }

  button {
    border: none;
    padding: 10px 20px;
    color:white;
    cursor:pointer;
    background-color:transparent;
    @media (max-width: 991px) {
      padding: 10px 30px;
    }
  }
  &:hover {
    background-color: #1d5a96; /* Изменение цвета при наведении */
  }

  /* Добавьте обработчик событий по вашему выбору */
  &:active {
    background-color: #144276; /* Изменение цвета при активации */
  }
`;


const DividerWithText = styled.div`
 display: flex;
  align-items: center;
  gap: 17px;
  font-size: 16px;
  color: #4f4f4f;
  font-weight: 300;
  text-align: center;
  margin-top: 30px;
  &::before,
  &::after {
    content: '';
    flex-grow: 1;
    border-bottom: 1px solid #989898;
  }

  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;


const GoogleSignIn = styled.div`
  display: flex;
  margin-top: 30px;
  border-radius: 6px;
  border: 1px solid #2b79c2;
  gap: 20px;
  font-size: 19px;
  color: #8b8b8b;
  font-weight: 400;
  padding: 10px 60px;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 6px 20px;
  }
  &:hover {
    background-color: #FAF9F6; /* Изменение цвета при наведении */
  }
`;

const PromoSection = styled.aside`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  align-items: center;
  white-space: nowrap;
  @media (max-width: 991px) {
    max-width: 100%;
    white-space: initial;
  }
`;

const PromoImage = styled.img`
  aspect-ratio: 1.2;
  object-fit: contain;
  width: 85%;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const PromoTitle = styled.h3`
  color: #292828;
  text-align: center;
  margin-top: 28px;
  font: 400 20px Roboto, sans-serif;
`;

const PromoText = styled.p`
  color: #4c4c4c;
  margin-top: -5px;
  font: 300 14px Roboto, sans-serif;
  
`;


const AccountActions = styled.div`
  color: #2b79c2;
  flex-grow: 1;
  font: 400 16px Roboto, sans-serif;
  color: #707070;
  margin-top:50px;
  text-align: center;
  white-space: nowrap;
  font: 400 19px Roboto, sans-serif;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const CreateAccountLink = styled.a`
  color: #2b79c2;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top:10px;
  gap: 15px;
`;

const SocialIcon = styled.button`
  border:none;
  background-color: #acdbfd;
  cursor:pointer;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  &:hover {
    background-color: #00A5E0;
  }
`;
export default SignInPage;