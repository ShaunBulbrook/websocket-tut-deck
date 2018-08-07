import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import io from 'socket.io-client';

const StyledChatInputContainer = styled.div`
	background: #2C3539;
	border: 1px solid #222;
	box-shadow: 0px 2px 7px 1px #666;
	color: #D3D0CB;
	font-size: 16px;
	line-height: 100%;
	margin: 0 auto;
	margin-top: 20px;
	overflow-y: auto;
	padding: 20px;
	text-align: left;
`;
const StyledLabel = styled.label`
	display: inline-block;
	vertical-align: top;
	line-height: 31px;
	margin-right: 10px;
`;
const StyledInput = styled.input`
	font-size: 24px;
	border: none;
	box-shadow: none;
`;
const StyledFormElementWrappers = styled.div`
	border-left: 1px solid #D3D0CB;
	border-top: 1px solid #D3D0CB;
	border-bottom: 1px solid #D3D0CB;
	box-shadow: 0px 2px 7px 1px #333;
	padding-left: 12px;
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
	display: inline-block;
	height: 30px;

	&:first-child {
		margin-right: 16px;
	}
`;

class ChatInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			author: '',
		}
		this.handleMessageKeyPress = this.handleMessageKeyPress.bind(this);
		this.handleAuthorChange = this.handleAuthorChange.bind(this);
	}


	render() {
		return (
			<StyledChatInputContainer>
				<StyledFormElementWrappers>
					<StyledLabel htmlFor="name">
						Name:
					</StyledLabel>
					<StyledInput type="text" id="name" onBlur={this.handleAuthorChange}/>
				</StyledFormElementWrappers>
				<StyledFormElementWrappers>
					<StyledLabel htmlFor="message">
						Message:
					</StyledLabel>
					<StyledInput type="text" id="message" onKeyPress={this.handleMessageKeyPress} />
				</StyledFormElementWrappers>
			</StyledChatInputContainer>
		);
	}

	componentDidMount() {
		this.socketConnect();
	}

	socketConnect() {
		this.socket = io('localhost:4001');
		this.socket.on('disconnect', () => {
			this.socket.open();
		});
	}

	handleMessageKeyPress(event) {
		if(event.key === 'Enter') {
			this.socket.emit('new message authored', {
				author: this.state.author,
				message: event.target.value,
			});
			event.target.value = '';
		}
	}

	handleAuthorChange(event) {
		this.setState({
			author: event.target.value
		});
	}
}

export default ChatInput;
