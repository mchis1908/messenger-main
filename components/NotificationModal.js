import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const NotificationModal = ({ message, isVisible, onConfirm }) => {
    return (
        <Modal isVisible={isVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.titleText}>Notification</Text>
            <Text style={styles.messageText}>{message}</Text>
            <View style={styles.btnConfirmContainer}>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={styles.linkText}>OK</Text>
            </TouchableOpacity>
            </View>
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
        alignItems: 'flex-start',
      },
      titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      messageText: {
        fontSize: 16,
        marginBottom: 10,
      },
      btnConfirmContainer: {
        alignSelf: 'flex-end', 
      },
      linkText: {
        fontSize: 16,
        fontWeight:600,
        color: '#4A55A2',
      }
    });

export default NotificationModal;
