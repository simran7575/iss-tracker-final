import React, { Component } from 'react';
import { Text, View,Alert ,SafeAreaView, FlatList,StyleSheet,Platform, StatusBar,ImageBackground,Image} from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends Component {
    constructor(props){
     super(props);
     this.state={
         meteors:{}
     }
    }

// to get meteors data from API call
    getMeteors=()=>{
        axios.get("https://api.nasa.gov/neo/rest/v1/feed?api_key=HMTWuWYbh95pnlO4hfGttnIsrluy8XjQ76mGk48B")
        .then(response=>{
            this.setState({meteors:response.data.near_earth_objects})
        })
        .catch(error=>{
            alert(error.message)
        })
    }


    componentDidMount(){
        this.getMeteors();
    }

    keyExtractor = (item,index)=>{index.toString()}

    renderItem = (item)=>{
        let meteor = item;
        let bg_img, speed, size;
        if(meteor.threat_score<=30){
            bg_img = require("../assets/meteor_bg1.png");
            speed = require("../assets/meteor_speed1.gif");
            size = 100;
        }
        else if(meteor.threat_score<=75){
            bg_img = require("../assets/meteor_bg2.png");
            speed = require("../assets/meteor_speed2.gif");
            size = 150;

        }
        else{
            bg_img = require("../assets/meteor_bg3.png");
            speed = require("../assets/meteor_speed3.gif");
            size = 200;
            
        }
        return (
            <View>
                <ImageBackground source={bg_img} style={styles.backgroundImage}>
                    <View style={styles.gifContainer}>
                        <Image source={speed} style={{width:size, height:size , alignSelf:"auto"}}/>
                   
                    <View>
                    <Text style={[styles.cardTitle,{marginTop:400, marginLeft:50}]}>{item.item.name}</Text>
                    <Text style={[styles.cardText,{marginTop:20, marginLeft:50}]}>Closest to Earth - {item.item.close_approach_data[0].close_approach_date_full}</Text>
                    <Text style={[styles.cardText,{marginTop:5, marginLeft:50}]}>Minimum Diameter(KM) - {item.item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
                    <Text style={[styles.cardText,{marginTop:5, marginLeft:50}]}>Maximum Diameter(KM) - {item.item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
                    <Text style={[styles.cardText,{marginTop:5, marginLeft:50}]}>Velocity(KM/H) - {item.item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                    <Text style={[styles.cardText,{marginTop:5, marginLeft:50}]}>Missing Earth by(KM) - {item.item.close_approach_data[0].miss_distance.kilometers}</Text>
               </View>
               </View>
                </ImageBackground>
    
            </View>
        )

    }

    render() {
       
        if(Object.keys(this.state.meteors).length === 0){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <Text>Loading ... Please Wait</Text>
                </View>
            )
        }
        else{
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date=>{
                return this.state.meteors[meteor_date]
            })
            var bigarray = [].concat.apply([],meteor_arr);

            bigarray.forEach(element => {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max)/2
                let threatScore = (diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000;
                element.threat_score = threatScore;
           
            });
            bigarray.sort(function(a,b){return b.threat_score - a.threat_score})
            bigarray.slice(0,5);


        return (
            <View
                style={styles.container}>
                    <SafeAreaView style={styles.safeArea}/>
                    <FlatList 
                         keyExtractor = {this.keyExtractor}
                         data = {bigarray}
                         renderItem = {this.renderItem}
                         horizontal= {true}/>
            </View>
        )
    }}
}

const styles= StyleSheet.create({
    container:{
        flex:1
    },
    safeArea:{
        marginTop: Platform.OS === 'android'? StatusBar.currentHeight:0
    },
    backgroundImage:{
     flex:1,
     resizeMode:"cover",
     width:'100%',
     height:'100%'
    },
    gifContainer:{
        justifyContent:"center",
        alignItems:"center",
        flex:1
    }, 
    cardTitle:{
        fontSize:20,
        marginBottom:10,
        fontWeight:"bold",
        color:"white"
    },
    cardText:{
        color:"white"
    }
})
