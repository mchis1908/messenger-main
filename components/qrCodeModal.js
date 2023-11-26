import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons'; 
import { UserType } from '../UserContext';

const QRCodeModal = ({ userData, isVisible, onClose }) => {
    const { userId } = useContext(UserType);
	const handleCloseModal = () => {
		onClose();
	};

    return (
        <Modal isVisible={isVisible}>
			<View style={styles.modalContainer}>
				<QRCode value={userId} size={250}/>
				<Pressable onPress={handleCloseModal} style={styles.closeStyle}>
					<Ionicons name="ios-close" size={24} color="#FF6D60" />
					<Text style={styles.textStyle}>Close</Text>
				</Pressable>
			</View>
        </Modal>
      );
    };
    
    const styles = StyleSheet.create({
      modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
      },
	  textStyle: {
		marginTop: 20,
		fontSize: 20,
		fontWeight: 400,
		color: "#FF6D60",
		height: "100%"
	  },
	  closeStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		gap: 10,
		paddingHorizontal: 10,
		borderRadius: 24,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,

		elevation: 24,
        borderWidth: 1,
        borderColor: "#FF6D60"
	  }
    });

export default QRCodeModal;
