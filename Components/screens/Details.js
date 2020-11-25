import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Dimensions,
  StatusBar,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import ReadMore from 'react-native-read-more-text';
import {Overlay, Button as EButton, Image} from 'react-native-elements';
import {Button, Card} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import Feather from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';

import {normalize} from '../reusable/Responsive';
import {LoadingContext} from '../../Context';
import {fetchGameById, fetchScreenshots} from '../api';
import {connect} from 'react-redux';
import {mapStateToProps} from '../reusable/mapProps';
import {purple_3} from '../reusable/colors';

const {width, height} = Dimensions.get('window');

function Details(props) {
  const [game, setGame] = useState(null);
  const {showLoading, hideLoading} = useContext(LoadingContext);
  const [screenshots, setScreenshots] = useState(null);
  const [{reqOverlay}, setOverlay] = useState({
    reqOverlay: false,
  });
  const [{req, minReq, recReq}, setHasReq] = useState({
    req: false,
    minReq: false,
    recReq: false,
  });
  const [bgImageHeight, setBGImageHeight] = useState(height * 0.415);
  const [showHeaderColor, setShowHeaderColor] = useState(false);
  const [_new, setNew] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const ssRef = useRef(null);

  useEffect(() => {
    if (game === null) {
      showLoading();
      const {id} = props.route.params.item;
      (async () => {
        await getGame(id);
      })();

      props.games.forEach((game) => {
        if (game.id === id) {
          setNew(false);
        }
      });
    }
    return () => {
      getGame;
      hideLoading();
    };
  }, []);

  useEffect(() => {
    let i = 0;
    console.log('screen sht', screenshots);
    const interval = setInterval(() => {
      if (screenshots != null && screenshots.length > 3) {
        i = (i + 1) % (screenshots.length - 1);
        ssRef.current.scrollToIndex({
          index: i,
          animated: true,
        });
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [screenshots]);

  const getGame = async (id) => {
    const {results} = await fetchScreenshots(id);
    setScreenshots(results);

    const _game = await fetchGameById(id);
    setGame(_game);
    hideLoading();

    const pc = _game.platforms.find(
      (platform) => platform.platform.name.toLowerCase() === 'pc',
    );
    try {
      if ('requirements' in pc && pc.requirements !== null) {
        setHasReq((prev) => ({...prev, req: true}));
        if ('minimum' in pc.requirements) {
          setHasReq((prev) => ({...prev, minReq: true}));
        }
        if ('recommended' in pc.requirements) {
          setHasReq((prev) => ({...prev, recReq: true}));
        }
      }
    } catch (err) {}
  };

  if (game === null) {
    return null;
  }

  const handleScroll = ({nativeEvent}) => {
    if (nativeEvent.contentOffset.y >= height * 0.175) {
      setShowHeaderColor(true);
    } else if (showHeaderColor) {
      setShowHeaderColor(false);
    }
    let x = bgImageHeight - nativeEvent.contentOffset.y;
    if (x < height * 0.3) setBGImageHeight(height * 0.3);
    else setBGImageHeight(x);
  };

  const _renderRevealedFooter = (handlePress) => (
    <Text style={{color: 'grey'}} onPress={handlePress}>
      show less
    </Text>
  );

  const _renderTruncatedFooter = (handlePress) => (
    <Text style={{color: 'grey'}} onPress={handlePress}>
      show more
    </Text>
  );

  const renderScreenshot = ({item}) => (
    <TouchableOpacity
      onPress={() => setShowModal(true)}
      style={{marginRight: 5, borderRadius: 5}}>
      <Image
        source={{uri: item.image}}
        style={{width: width * 0.3, height: width * 0.2}}
        PlaceholderContent={
          <LottieView
            source={require('../../assets/animations/image-loader.json')}
            autoPlay
            loop
          />
        }
        placeholderStyle={{width: width * 0.3, height: width * 0.2}}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor={showModal ? 'black' : 'transparent'}
        />
        <ScrollView onScroll={handleScroll}>
          <View>
            <Image
              source={{uri: game.background_image_additional}}
              style={[styles.bgImage, {height: bgImageHeight}]}
              PlaceholderContent={
                <LottieView
                  source={require('../../assets/animations/image-loader.json')}
                  autoPlay
                  loop
                />
              }
              placeholderStyle={[styles.bgImage, {height: bgImageHeight}]}
            />
            {/* )} */}
            <Card style={styles.profileImage}>
              <Card.Cover
                source={{uri: game.background_image}}
                style={{height: width * 0.25, width: width * 0.4}}
              />
            </Card>
          </View>
          <View style={styles.footer}>
            <Text style={styles.header}>{game.name}</Text>
            <View style={{margin: 5}}>
              <ReadMore
                numberOfLines={4}
                renderRevealedFooter={_renderRevealedFooter}
                renderTruncatedFooter={_renderTruncatedFooter}>
                <Text
                  style={{
                    textAlign: 'justify',
                    color: '#4a4a48',
                  }}>
                  {game.description_raw}
                </Text>
              </ReadMore>
            </View>
            <View>
              <Text style={styles.tag}>Game Screenshots:</Text>
              <FlatList
                data={screenshots}
                renderItem={renderScreenshot}
                horizontal
                style={{marginLeft: 5}}
                keyExtractor={(item, index) => index + ''}
                ref={ssRef}
                ListEmptyComponent={
                  <Text style={styles.val}>Not Available</Text>
                }
                getItemLayout={(data, index) => ({
                  length: screenshots !== null ? screenshots.length : 0,
                  offset: normalize(100) * index,
                  index,
                })}
              />
            </View>
            <Text style={styles.item}>
              <Text style={styles.tag}>Playtime: </Text>
              <Text style={styles.val}>
                {game.playtime === 0
                  ? 'Not Available'
                  : game.playtime + ' Hour(s)'}
              </Text>
            </Text>
            <Text style={styles.item}>
              <Text style={styles.tag}>Ratings: </Text>
              <Text style={styles.val}>
                {game.rating} ({game.ratings_count})
              </Text>
            </Text>
            <Text style={styles.item}>
              <Text style={styles.tag}>Genre: </Text>
              <Text style={styles.val}>
                {game.genres.map((genre, i) => {
                  return i === 0 ? genre.name : ' ,' + genre.name;
                })}
              </Text>
            </Text>
            <Text style={styles.item}>
              <Text style={styles.tag}>Released: </Text>
              <Text style={styles.val}>{game.released}</Text>
            </Text>
            <Text style={styles.item}>
              <Text style={styles.tag}>Publishers: </Text>
              <Text style={styles.val}>
                {game.publishers.map((p, i) => {
                  return i === 0 ? p.name : ' ,' + p.name;
                })}
              </Text>
            </Text>
            <Text style={styles.item}>
              <Text style={styles.tag}>Developers: </Text>
              <Text style={styles.val}>
                {game.developers.map((d, i) => {
                  return i === 0 ? d.name : ' ,' + d.name;
                })}
              </Text>
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.tag}>PC Requirements: </Text>
              {req ? (
                <EButton
                  onPress={() =>
                    setOverlay((prev) => ({...prev, reqOverlay: true}))
                  }
                  title="Show"
                  type="clear"
                  titleStyle={styles.showButton}
                />
              ) : (
                <Text style={styles.val}>Not Available</Text>
              )}
            </View>
            <Text style={styles.item}>
              <Text style={styles.tag}>Official Website: </Text>
              <Text
                style={
                  'website' in game && game.website !== ''
                    ? styles.link
                    : styles.val
                }
                onPress={() => Linking.openURL(game.website)}>
                {'website' in game && game.website !== ''
                  ? game.website
                  : 'Not Available'}
              </Text>
            </Text>
          </View>
        </ScrollView>
        {req && (
          <Overlay
            isVisible={reqOverlay}
            onBackdropPress={() =>
              setOverlay((prev) => ({...prev, reqOverlay: false}))
            }
            overlayStyle={styles.overlay}>
            <>
              <View style={{elevation: 20}}>
                <Text
                  style={[
                    styles.tag,
                    {textAlign: 'center', fontSize: normalize(16)},
                  ]}>
                  PC Requirements
                </Text>
              </View>
              <ScrollView>
                {minReq && (
                  <HTMLView
                    value={
                      game.platforms.find(
                        (platform) =>
                          platform.platform.name.toLowerCase() === 'pc',
                      ).requirements.minimum
                    }
                    style={{width: '100%'}}
                  />
                )}
                <View
                  style={{
                    margin: 20,
                  }}
                />
                {recReq && (
                  <HTMLView
                    value={
                      game.platforms.find(
                        (platform) =>
                          platform.platform.name.toLowerCase() === 'pc',
                      ).requirements.recommended
                    }
                    style={{width: '100%'}}
                  />
                )}
              </ScrollView>
              <Button
                style={{alignSelf: 'flex-end'}}
                onPress={() =>
                  setOverlay((prev) => ({...prev, reqOverlay: false}))
                }>
                Close
              </Button>
            </>
          </Overlay>
        )}
      </View>
      {_new && (
        <Button
          mode="contained"
          style={{borderRadius: 0}}
          onPress={() =>
            props.navigation.navigate('Configure', {
              item: props.route.params.item,
            })
          }>
          Add Game
        </Button>
      )}
      <View
        style={{
          width: width,
          backgroundColor: showHeaderColor ? purple_3 : 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
        <View style={{padding: 10}}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={30}
              color="#fff"
              style={{marginLeft: 5, marginTop: 20}}
            />
          </TouchableOpacity>
        </View>
        {screenshots !== null && (
          <Modal visible={showModal}>
            <ImageViewer
              imageUrls={screenshots.map((ss) => {
                return {url: ss.image};
              })}
              loadingRender={() => (
                <LottieView
                  source={require('../../assets/animations/image-loader.json')}
                  autoPlay
                  loop
                />
              )}
            />
            <View
              style={{
                alignItems: 'center',
                paddingBottom: normalize(30),
                backgroundColor: 'black',
              }}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather
                  name="x"
                  color="#fff"
                  size={normalize(30)}
                  style={{
                    borderRadius: 30,
                    padding: 10,
                    backgroundColor: 'grey',
                  }}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    fontSize: normalize(23),
    fontWeight: 'bold',
    color: '#434445',
  },
  footer: {
    padding: 10,
    position: 'relative',
    top: -50,
  },
  profileImage: {
    position: 'relative',
    top: -50,
    left: 10,
    width: width * 0.41,
    padding: 2,
  },
  tag: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    margin: 5,
    color: '#434445',
  },
  overlay: {
    margin: 30,
    height: '80%',
  },
  item: {
    margin: 5,
  },
  val: {
    color: '#5c5a59',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  showButton: {
    color: '#8a36c9',
    fontSize: normalize(14),
  },
  bgImage: {
    width: '100%',
    minHeight: height * 0.35,
  },
});

export default connect(mapStateToProps)(Details);
