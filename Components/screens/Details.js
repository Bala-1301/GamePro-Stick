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
import {api_call} from '../helper_functions/api';
import {connect, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {getDimensions} from '../reusable/ScreenDimensions';
import {LoadingContext} from '../reusable/contexts/LoadingContext';

const {SCREEN_WIDTH, SCREEN_HEIGHT} = getDimensions();

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
  const [bgImageHeight, setBGImageHeight] = useState(SCREEN_HEIGHT * 0.415);
  const [showHeaderColor, setShowHeaderColor] = useState(false);
  const [_new, setNew] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const games = useSelector((state) => state.games);

  const ssRef = useRef(null);

  useEffect(() => {
    if (game === null) {
      showLoading();
      const {id} = props.route.params.item;
      (async () => {
        await getGame(id);
      })();

      games.forEach((game) => {
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
    const response = await api_call({
      apiUrl: `/games/${id}/screenshots`,
    });
    if (response) {
      const {results} = response;
      setScreenshots(results);
    }

    const _game = await api_call({
      apiUrl: `games/${id}`,
    });

    if (_game) {
      setGame(_game);
      hideLoading();
    } else {
      showMessage({
        message: "Couldn't fetch",
        description: 'Error fetching data. Please try later',
        type: 'danger',
        floating: 'true',
        position: 'center',
      });
    }

    const pc = _game.platforms.find(
      (platform) => platform.platform.name.toLowerCase() === 'pc',
    );
    try {
      if ('requirements' in pc && pc.requirements !== null) {
        console.log(pc.requirements);

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

  const handleScroll = ({nativeEvent}) => {
    if (nativeEvent.contentOffset.y >= SCREEN_HEIGHT * 0.175) {
      setShowHeaderColor(true);
    } else if (showHeaderColor) {
      setShowHeaderColor(false);
    }
    let x = bgImageHeight - nativeEvent.contentOffset.y;
    if (x < SCREEN_HEIGHT * 0.3) setBGImageHeight(SCREEN_HEIGHT * 0.3);
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
        style={{width: SCREEN_WIDTH * 0.3, height: SCREEN_WIDTH * 0.2}}
        PlaceholderContent={
          <LottieView
            source={require('../../assets/animations/image-loader.json')}
            autoPlay
            loop
          />
        }
        placeholderStyle={{
          width: SCREEN_WIDTH * 0.3,
          height: SCREEN_WIDTH * 0.2,
        }}
      />
    </TouchableOpacity>
  );

  if (game === null) {
    return <View style={{flex: 1, backgroundColor: '#000'}}></View>;
  }

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
                style={{height: SCREEN_WIDTH * 0.25, width: SCREEN_WIDTH * 0.4}}
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
                <Text style={styles.description}>{game.description_raw}</Text>
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
                  title="VIEW"
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
                    stylesheet={htmlStyles}
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
                    stylesheet={htmlStyles}
                  />
                )}
              </ScrollView>
              <Button
                style={{alignSelf: 'flex-end'}}
                color="red"
                onPress={() =>
                  setOverlay((prev) => ({...prev, reqOverlay: false}))
                }>
                Close
              </Button>
            </>
          </Overlay>
        )}
      </View>
      <Button
        mode="contained"
        color="red"
        style={{borderRadius: 0}}
        onPress={() =>
          props.navigation.navigate('Configure', {
            item: props.route.params.item,
          })
        }>
        {_new ? 'Add Game' : 'Edit Config'}
      </Button>
      <View
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT * 0.1,
          backgroundColor: showHeaderColor ? '#000' : 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          justifyContent: 'center',
          borderBottomColor: '#fff',
          borderBottomWidth: showHeaderColor ? 1 : 0,
        }}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{flex: 0.5}}>
            <Feather
              name="chevron-left"
              color="#fff"
              size={SCREEN_WIDTH * 0.07}
              style={{marginLeft: 5, marginTop: 20}}
            />
          </TouchableOpacity>
          {showHeaderColor && (
            <>
              {/* <View style={{flex: 0.5}}></View> */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: normalize(17),
                    fontWeight: 'bold',
                    marginTop: 20,
                  }}>
                  {game.name}
                </Text>
              </View>
              <View style={{flex: 0.5}}></View>
            </>
          )}
        </View>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    textAlign: 'center',
    fontSize: normalize(23),
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    textAlign: 'justify',
    color: '#fff',
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
    width: SCREEN_WIDTH * 0.41,
    padding: 2,
  },
  tag: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    margin: 5,
    color: '#fff',
  },
  overlay: {
    margin: 30,
    height: '80%',
    backgroundColor: '#292827',
  },
  item: {
    margin: 5,
  },
  val: {
    color: '#e1e7e8',
  },
  link: {
    color: '#2cadc7',
    textDecorationLine: 'underline',
  },
  showButton: {
    color: 'red',
    fontSize: normalize(12),
  },
  bgImage: {
    width: '100%',
    minHeight: SCREEN_HEIGHT * 0.35,
  },
});

const htmlStyles = StyleSheet.create({
  p: {color: '#ffffff'},
  h1: {color: '#ffffff'},
  h2: {color: '#ffffff'},
  h3: {color: '#ffffff'},
  h4: {color: '#ffffff'},
  h5: {color: '#ffffff'},
  h6: {color: '#ffffff'},
  span: {color: '#ffffff'},
  div: {color: '#ffffff'},
  ul: {color: '#ffffff'},
  strong: {color: '#ffffff'},
});

export default Details;
