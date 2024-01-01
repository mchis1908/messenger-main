import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function GroupMemberItem({ memberInfo }) {
    return (
        <View style={styles.memberContainer}>
            <Image style={styles.memberAvatar} source={{ uri: memberInfo.image }}/>
            <View style={styles.memberBody}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "black" }}>{ memberInfo.name }</Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>{ memberInfo.email }</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    memberContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    }, memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    }, memberBody: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 5,
    },
    buttonMessage: {
        backgroundColor: "#0066b2",
        borderRadius: 6,
        width: 80,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    }
})