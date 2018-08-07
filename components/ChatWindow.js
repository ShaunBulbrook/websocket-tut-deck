import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import io from 'socket.io-client';

const StyledChatWindowContainer = styled.div`
	background: #2C3539;
	border: 1px solid #222;
	box-shadow: 0px 2px 7px 1px #666;
	color: #D3D0CB;
	font-size: 16px;
	line-height: 110%;
	margin: 0 auto;
	margin-top: 20px;
	overflow-y: auto;
	padding: 20px;
	transition: all 1s ease-in;
	height: 500px;

	::-webkit-scrollbar {
    	display: none;
	}
`;
const fadeInFromTop = keyframes`
	0% {
		margin-top: -10px;
		opacity: 0;
	}
	100% {
		margin-top: 0px;
		opacity: 1;
	}
`;
const StyledLi = styled.li`
	animation: ${fadeInFromTop} 0.3s ease-in;
	border: 1px solid #9FB1BC;
	border-radius: 6px;
	display: block;
	list-style: none;
	margin-bottom: 10px;
	padding: 20px;
	text-align: left;
	word-break: break-all;
	vertical-align: top;
`;
const StyledUl = styled.ul`
	margin: 0;
	padding: 0;
`;
const StyledMessageHeading = styled.span`
	border-right: 1px solid #E2C044;
	padding-right: 5px;
	display: inline-block;
	margin-right: 20px;
	text-align: left;
	width: 100px;
`;
const StyledMessage = styled.span`
	vertical-align:  top;
`;
class ChatWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chatHistory: [
				{
					author: 'clientTest',
					message: 'test message from the same client',
				}
			],
		};
		this.baseWindowRef = React.createRef();
	}

	render() {
		return (
			<StyledChatWindowContainer>
				<StyledUl>
					{
						this.state.chatHistory.map((item, i) => (
							<StyledLi key={i}>
								<StyledMessageHeading>{item.author} </StyledMessageHeading>
								<StyledMessage>{item.message}</StyledMessage>
							</StyledLi>
						))
					}
				</StyledUl>
				<div ref={this.baseWindowRef}></div>
			</StyledChatWindowContainer>
		);
	}

	componentDidMount () {
		console.log('state');
		console.log(this.state);

		this.socketConnect();
		this.listenForSocketEvents();
	}

	componentDidUpdate() {
		//this.baseWindowRef.current.scrollIntoView({ behavior: 'smooth' });
	}

	socketConnect() {
		this.socket = io('localhost:4001');
		// this.socket.on('disconnect', () => {
		// 	this.socket.open();
		// });
	}

	listenForSocketEvents() {
		this.socket.on('update chat', (data) => {
			console.log('hit');
			const chatHistory = this.state.chatHistory.slice();
			chatHistory.push(data);
			this.setState({chatHistory: chatHistory});
		});
	}
}


export default ChatWindow;
