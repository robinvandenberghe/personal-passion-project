import React, { useState } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Colors, { dropShadow} from '../constants/Colors';
import { Text, SwitchView } from './Themed';
import Event from './Event';
import Carousel, { Pagination, ParallaxImage , AdditionalParallaxProps} from 'react-native-snap-carousel';
import useColorScheme from '../hooks/useColorScheme';


export default function Post({post}:{post:any}) {
  const { date, message, event , images} = post.item;
  const {width: windowWidth} = Dimensions.get('window');
  const [ activeSlide, setActiveSlide ] = useState(0);
  const colorScheme = useColorScheme();

  const renderImage = (renderItem: { item: any; index: number; }, parallaxProps?: AdditionalParallaxProps) =>{
    const { item } = renderItem;
    return <ParallaxImage parallaxFactor={0.4} style={styles.postImage} containerStyle={styles.imageContainer} source={{uri: `http://192.168.1.35/assets/img/posts/${item}`}} {...parallaxProps} />;
  }

  return (
    <SwitchView style={styles.container}>
      <Text style={styles.subText}>{parsePostingTime(date.toDate())}</Text>
      {message? <Text style={styles.message}>{message}</Text> :null}
      {event? <Event event={event} /> :null}
      {images?
        <>
        <Carousel
          data={images}
          renderItem={renderImage}
          onSnapToItem={(index) => setActiveSlide(index) }
          itemWidth={windowWidth - 68}
          sliderWidth={windowWidth - 52}
          sliderHeight={windowWidth}
          hasParallaxImages
          containerCustomStyle={styles.carousel}
          loop
          ref={(c) => { this._carousel = c; }}
        />
        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeSlide}
          dotStyle={[styles.dotStyle, {backgroundColor: Colors[colorScheme].text}]}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._carousel}
          tappableDots
          containerStyle={{marginVertical:-24}}
        />
      </>:null}
    </SwitchView>
  );
}

const parsePostingTime = (date: any) =>{
  const diff = date_diff_inminutes(date, new Date());
  if(diff == 0){
      return 'Zojuist';
  }else if(diff<=60){
    return `${diff}m geleden`;
  }else if(diff>60 && (diff/60)<24){
    return `${Math.round(diff/60)}u geleden`;
  }else{
    const displayDate = new Date(date);
    return `${displayDate.toLocaleDateString('nl-BE')} - ${displayDate.toLocaleTimeString('nl-BE', {hour: '2-digit', minute:'2-digit'})}`;
  }
}

const date_diff_inminutes = (date1: any, date2: any) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);
  return Math.round((dt2.getTime() - dt1.getTime()) / 1000 / 60  );
}

const styles = StyleSheet.create({
  container: {
    minWidth:'99%',
    maxWidth: '100%',
    flexShrink:1,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'flex-start',
    marginBottom: 16,
    ...dropShadow
  },
  subText:{
    fontSize: 14,
    fontWeight: '500',
  },
  message:{
    marginTop:8,
    fontSize: 16,
  },
  postImage:{
    ...StyleSheet.absoluteFillObject,
    resizeMode:'contain'
  },
  imageContainer:{
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    borderRadius: 8,
  },
  dotStyle:{
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  carousel:{
    flex:1,
    maxHeight: 320,
    marginVertical: 8,
  }
});
