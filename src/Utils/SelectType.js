//import liraries
import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, FlatList, TextInput, Dimensions, Animated, Platform, Alert, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();
import Modal from 'react-native-modal';
import TagItem from './SCLib/TagItem';
import utilities from './SCLib/utilities';
import PropTypes from 'prop-types';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB, CustomText, TextRobotoB, CustomTextR, CustomTextM} from "../Components/CustomText";

const { height } = Dimensions.get('window');
const INIT_HEIGHT = height * 0.5;
// create a component
class SelectType extends Component {
    static defaultProps = {
        cancelButtonText: 'Cancel',
        selectButtonText: 'Okay',
        searchPlaceHolderText: "Enter a keyword",
        listEmptyTitle: 'Result is nothing',
        colorTheme: '#16a45f',
        buttonTextStyle: {},
        buttonStyle: {},
        showSearchBox: true
    }
    state = {
        show: false,
        preSelectedItem: [],
        selectedItem: [],
        data: [],
        keyword: ''
    }
    animatedHeight = new Animated.Value(INIT_HEIGHT);

    componentDidMount() {
        this.init();
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        this.init(newProps);
    }

    init(newProps) {
        let preSelectedItem = [];
        let { data } = newProps || this.props;
        data.map(item => {
            if (item.checked) {
                preSelectedItem.push(item);
            }
        })
        this.setState({ data, preSelectedItem });
    }

    get dataRender() {
        let { data, keyword } = this.state;
        let listMappingKeyword = [];
        data.map(item => {
            if (utilities.changeAlias(item.name).includes(utilities.changeAlias(keyword))) {
                listMappingKeyword.push(item);
            }
        });
        return listMappingKeyword;
    }

    get defaultFont() {
        let { defaultFontName } = this.props;
        return defaultFontName ? { fontFamily: defaultFontName } : {};
    }

    cancelSelection() {
        let { data, preSelectedItem } = this.state;
        data.map(item => {
            item.checked = false;
            for (let _selectedItem of preSelectedItem) {
                if (item.id === _selectedItem.id) {
                    item.checked = true;
                    break;
                }
            }
        });
        this.setState({ data, show: false, keyword: '', selectedItem: preSelectedItem });
    }

    onItemSelected = (item, isSelectSingle) => {
        let selectedItem = [];
        let { data } = this.state;
        item.checked = !item.checked;
        for (let index in data) {
            if (data[index].id === item.id) {
                data[index] = item;
            } else if (isSelectSingle) {
                data[index].checked = false;
            }
        }
        data.map(item => {
            if (item.checked) selectedItem.push(item);
        })
        this.props.onSelect(item.id);
        //this.setState({ show: false, data, item });
        console.log('isSelectSingle', isSelectSingle)
        if ( isSelectSingle === false) {
            this.setState({ data, selectedItem });
        }else{
            this.setState({ show: false, data, selectedItem });
        }
        
        //this.setState({ show: false, keyword: '', preSelectedItem: selectedItem });
    }
    keyExtractor = (item, idx) => idx.toString();
    renderItem = ({ item, idx }) => {
        let { colorTheme, isSelectSingle } = this.props;
        return (
            <TouchableOpacity
                key={idx}
                onPress={() => {
                    if(!item.checked) {
                        this.onItemSelected(item, isSelectSingle)
                    }
                }}
                activeOpacity={0.7}
                style={styles.itemWrapper}>
                <Icon style={styles.itemIcon}
                      name={item.checked ? 'radiobox-marked' : 'radiobox-blank'}
                      color={item.checked ? colorTheme : '#d7dce3'} size={20} />
                <CustomTextM style={item.checked ? styles.itemTextSelected : styles.itemText}>
                    {item.name}
                </CustomTextM>
            </TouchableOpacity>
        );
    }
    renderEmpty = () => {
        let { listEmptyTitle } = this.props;
        return (
            <Text style={[styles.empty, this.defaultFont]}>
                {listEmptyTitle}
            </Text>
        );
    }
    closeModal = () => this.setState({ show: false });
    showModal = () => this.setState({ show: true });

    render() {
        let {
            style, modalStyle, title, onSelect, onRemoveItem, popupTitle, colorTheme,
            isSelectSingle, cancelButtonText, selectButtonText, searchPlaceHolderText,
            selectedTitleStyle, buttonTextStyle, buttonStyle, showSearchBox, initHeight
        } = this.props;

        if(initHeight) this.animatedHeight = new Animated.Value(initHeight);


        let { show, selectedItem, preSelectedItem } = this.state;
        return (
            <TouchableOpacity
                onPress={this.showModal}
                activeOpacity={0.7}
                style={[styles.container, style]}>
                <Modal
                    onBackdropPress={this.closeModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0
                    }}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={show}>
                    <Animated.View style={[styles.modalContainer, modalStyle, { height: this.animatedHeight }]}>
                        <View style={{justifyContent:'center',alignItems:'center',paddingTop:15,borderBottomColor:'#ccc',borderBottomWidth:0.5}}>
                            <Text style={[styles.title, this.defaultFont, { color: colorTheme }]}>
                                {popupTitle || title}
                            </Text>
                        </View>
                        
                        {/*
                        <View style={styles.line} />
                        {
                            showSearchBox
                                ? <TextInput
                                    underlineColorAndroid='transparent'
                                    returnKeyType='done'
                                    style={[styles.inputKeyword, this.defaultFont]}
                                    placeholder={searchPlaceHolderText}
                                    selectionColor={colorTheme}
                                    onChangeText={keyword => this.setState({ keyword })}
                                    onFocus={() => {
                                        Animated.spring(this.animatedHeight, {
                                            toValue: INIT_HEIGHT + (Platform.OS === 'ios' ? height * 0.2 : 0),
                                            friction: 7
                                        }).start();
                                    }}
                                    onBlur={() => {
                                        Animated.spring(this.animatedHeight, {
                                            toValue: INIT_HEIGHT,
                                            friction: 7
                                        }).start();
                                    }}
                                />
                                : null
                        }
                        */}
                        <FlatList
                            style={[styles.listOption]}
                            data={this.dataRender || []}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                            ListEmptyComponent={this.renderEmpty}
                        />

                        {/*
                        <View style={styles.buttonWrapper}>
                            <Button
                                defaultFont={this.defaultFont}
                                onPress={() => {
                                    this.cancelSelection();
                                }}
                                title={cancelButtonText}
                                textColor={colorTheme}
                                backgroundColor='#fff'
                                textStyle={buttonTextStyle}
                                style={[styles.button, buttonStyle, { marginRight: 5, marginLeft: 10, borderWidth: 1, borderColor: colorTheme }]} />
                            <Button
                                defaultFont={this.defaultFont}
                                onPress={() => {
                                    //console.log('selectedItem',selectedItem);
                                    if ( selectedItem.length === 0 ) {
                                        Alert.alert(
                                            'Alert',
                                            '최소한 하나의 항목은 선택하셔야 합니다.',
                                            [
                                              {text: 'OK', onPress: () => console.log('OK Pressed')},
                                            ],
                                            {cancelable: false},
                                          );
                                    }else{
                                        let selectedIds = [], selectedObjectItems = [];
                                        selectedItem.map(item => {
                                            selectedIds.push(item.id);
                                            selectedObjectItems.push(item);
                                        })
                                        onSelect && onSelect(selectedIds, selectedObjectItems);
                                        this.setState({ show: false, keyword: '', preSelectedItem: selectedItem });
                                    }
                                }}
                                title={selectButtonText}
                                backgroundColor={colorTheme}
                                textStyle={buttonTextStyle}
                                style={[styles.button, buttonStyle, { marginLeft: 5, marginRight: 10 }]} />
                        </View>
                        */}
                    </Animated.View>
                </Modal>
                {
                    preSelectedItem.length > 0
                        ? (
                            isSelectSingle
                                ? 
                                <View style={{flexDirection:'row',flexGrow:1}}>
                                    <Text style={[styles.selectedTitlte, this.defaultFont, selectedTitleStyle]}>{preSelectedItem[0].name}</Text>
                                </View>
                                
                                : <View style={styles.tagWrapper}>
                                    {
                                        preSelectedItem.map((tag, index) => {
                                            return (
                                                <TagItem
                                                    key={index}
                                                    onRemoveTag={() => {
                                                        let preSelectedItem = [];
                                                        let selectedIds = [], selectedObjectItems = [];
                                                        let { data } = this.state;
                                                        data.map(item => {
                                                            if (item.id === tag.id) {
                                                                item.checked = false;
                                                            }
                                                            if (item.checked) {
                                                                preSelectedItem.push(item);
                                                                selectedIds.push(item.id);
                                                                selectedObjectItems.push(item);
                                                            };
                                                        })
                                                        this.setState({ data, preSelectedItem });
                                                        onRemoveItem && onRemoveItem(selectedIds, selectedObjectItems);
                                                    }}
                                                    tagName={tag.name}
                                                />
                                            );
                                        })
                                    }
                                </View>
                        )
                        : <Text style={[styles.selectedTitlte, this.defaultFont, selectedTitleStyle]}>{title}</Text>
                }
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: '100%', minHeight: 35, borderRadius: 2, paddingHorizontal: 17,
        flexDirection: 'row', alignItems: 'center', paddingVertical: 4,
        borderWidth: 1, borderColor: '#cacaca',
    },
    modalContainer: {
        paddingTop: 0, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    title: {
        fontSize: 16, marginBottom: 16, width: '100%', textAlign: 'center'
    },
    line: {
        height: 1, width: '100%', backgroundColor: '#cacaca'
    },
    inputKeyword: {
        height: 40, borderRadius: 5, borderWidth: 1, borderColor: '#cacaca',
        paddingLeft: 8, marginHorizontal: 24, marginTop: 16
    },
    buttonWrapper: {
        marginVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    button: {
        height: 36, flex: 1
    },
    selectedTitlte: {
        fontSize: 14, color: 'gray'
    },
    tagWrapper: {
        flexDirection: 'row', flexWrap: 'wrap'
    },
    listOption: {

        paddingHorizontal: 10,
        paddingTop: 1, marginTop: 10
    },
    itemWrapper: {
        //borderBottomWidth: 1, borderBottomColor: '#eaeaea',
        paddingVertical: 10, flexDirection: 'row', alignItems: 'center',
    },
    itemText: {
        color: '#343434',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    itemTextSelected: {
        color: '#8e8e8e',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    itemIcon: {
        width: 30, textAlign: 'right', marginRight: 18,
    },
    empty: {
        fontSize: 16, color: 'gray', alignSelf: 'center', textAlign: 'center', paddingTop: 16
    }
});

SelectType.propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object,
    defaultFontName: PropTypes.string,
    selectedTitleStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    title: PropTypes.string,
    onSelect: PropTypes.func,
    onRemoveItem: PropTypes.func,
    popupTitle: PropTypes.string,
    colorTheme: PropTypes.string,
    isSelectSingle: PropTypes.bool,
    showSearchBox: PropTypes.bool,
    cancelButtonText: PropTypes.string,
    selectButtonText: PropTypes.string
}

//make this component available to the app
export default SelectType;