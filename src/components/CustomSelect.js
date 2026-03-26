import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { colors } from '../constants/colors';
import { hp, hpPx, wp } from '../constants/constants';
import AnimatedIcon from './AnimatedIcon';

/**
 * CustomSelect
 * Props: data (array of { key?, value? }),
 * multiple (bool) default true,
 * onSelect (callback receives selected keys or value(s)),
 * placeholder, styles for customization similar to your original component.
 */
const CustomSelect = ({
    data = [],
    multiple = true,
    placeholder = 'Select option',
    boxStyles = {},
    inputStyles = {},
    dropdownStyles = {},
    dropdownItemStyles = {},
    dropdownTextStyles = {},
    maxHeight = 350,
    search = true,
    showSearch = false,
    showCheckboxes = false,
    searchPlaceholder = 'Search',
    onSelect = () => { },
    label,
    notFoundText = 'No data found',
    defaultOptions = [],
    placeholderTextColor = '#fff',
}) => {
    const [dropdown, setDropdown] = useState(false);
    const [height, setHeight] = useState(maxHeight);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const rot = useRef(new Animated.Value(0)).current;
    const [filteredData, setFilteredData] = useState(data);
    const [selectedVal, setSelectedVal] = useState(multiple ? [] : '');
    const [query, setQuery] = useState('');

    useEffect(() => { if (maxHeight) setHeight(maxHeight); }, [maxHeight]);
    useEffect(() => setFilteredData(data), [data]);
    useEffect(() => {
        if (defaultOptions && defaultOptions.length) {
            if (multiple) setSelectedVal(defaultOptions.map(o => o.value ?? o));
            else setSelectedVal(defaultOptions[0]?.value ?? defaultOptions[0] ?? '');
        }
    }, [defaultOptions]);

    const open = () => {
        setDropdown(true);
        Animated.timing(animatedValue, { toValue: height, duration: 300, useNativeDriver: false }).start();
        // rotate chevron to point up
        if (rot) Animated.timing(rot, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    };
    const close = () => {
        Animated.timing(animatedValue, { toValue: 0, duration: 300, useNativeDriver: false }).start(() => setDropdown(false));
        // rotate chevron back to down
        if (rot) Animated.timing(rot, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    };

    const toggle = () => { if (dropdown) close(); else { Keyboard.dismiss(); open(); } };

    const handleSelect = (item) => {
        const key = item.key ?? item.value ?? item;
        const value = item.value ?? item;
        if (multiple) {
            const exists = selectedVal.indexOf(value) !== -1;
            const next = exists ? selectedVal.filter(v => v !== value) : [...selectedVal, value];
            setSelectedVal(next);
            onSelect(next);
        } else {
            setSelectedVal(value);
            onSelect(key);
            close();
        }
    };

    const onSearch = (q) => {
        setQuery(q);
        const res = data.filter(item => (item.value ?? item).toString().toLowerCase().includes(q.toLowerCase()));
        setFilteredData(res);
    };

    const shouldShowSearch = typeof showSearch === 'boolean' ? showSearch : search;
    const shouldShowCheckboxes = typeof showCheckboxes === 'boolean' ? showCheckboxes : multiple;

    return (
        <View>
            <TouchableOpacity style={[styles.wrapper, boxStyles]} onPress={toggle} activeOpacity={0.8}>
                <View>
                    {label ? <Text style={[styles.label, { color: placeholderTextColor }]}>{label}</Text> : null}
                    {multiple ? (
                        selectedVal?.length ? (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: hpPx(6) }}>
                                {selectedVal.map((v, i) => (
                                    <View key={i} style={[styles.badge]}> <Text style={[styles.badgeText, { color: placeholderTextColor }]}>{v}</Text> </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={[{ color: placeholderTextColor }, inputStyles]}>{placeholder}</Text>
                        )
                    ) : (
                        <Text style={[{ color: placeholderTextColor }, inputStyles]}>{selectedVal || placeholder}</Text>
                    )}
                </View>
                <Animated.View style={{ transform: [{ rotate: rot.interpolate ? rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) : '0deg' }] }}>
                    <AnimatedIcon name={"Entypo:chevron-down"} size={20} color={placeholderTextColor} animationType={'none'} />
                </Animated.View>
            </TouchableOpacity>

            {dropdown ? (
                <Animated.View style={[{ maxHeight: animatedValue }, styles.dropdown, dropdownStyles]}>
                    <View style={{ maxHeight: height }}>
                        {shouldShowSearch ? (
                            <View style={styles.searchRow}>
                                <TextInput placeholder={searchPlaceholder} placeholderTextColor={placeholderTextColor} value={query} onChangeText={onSearch} style={[styles.searchInput, inputStyles]} />
                            </View>
                        ) : null}

                        <ScrollView contentContainerStyle={{ paddingVertical: 6 }} nestedScrollEnabled>
                            {filteredData.length ? filteredData.map((item, idx) => {
                                const value = item.value ?? item;
                                const disabled = item.disabled ?? false;
                                return (
                                    <TouchableOpacity key={idx} style={[styles.option, dropdownItemStyles]} disabled={disabled} onPress={() => handleSelect(item)}>
                                        {shouldShowCheckboxes ? (
                                            <View style={styles.checkbox}>{multiple && (selectedVal.includes(value) ? <Icon name="check" size={10} color={placeholderTextColor} /> : null)}</View>
                                        ) : null}
                                        <Text style={[dropdownTextStyles, { marginLeft: shouldShowCheckboxes ? 0 : 0, color: placeholderTextColor }]}>{value}</Text>
                                    </TouchableOpacity>
                                );
                            }) : (
                                <TouchableOpacity style={[styles.option, dropdownItemStyles]} onPress={() => { setSelectedVal(multiple ? [] : ''); close(); }}>
                                    <Text style={[dropdownTextStyles, { color: placeholderTextColor }]}>{notFoundText}</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                </Animated.View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        borderRadius: hp(1),
        borderColor: colors.white,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1.1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontWeight: '600'
    },
    badge: {
        backgroundColor: '#666',
        paddingHorizontal: wp(1.5),
        paddingVertical: hp(1.1),
        borderRadius: hp(2),
        marginRight: wp(2),
        marginTop: hp(2)
    },
    badgeText: {
        color: '#fff',
        fontSize: hp(1.2)
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        borderWidth: 1,
        borderRadius: hp(1),
        borderColor: '#ccc',
        overflow: 'hidden',
        marginTop: hp(0.5),
        zIndex: 1000,
    },
    option: {
        width: '100%',
        paddingHorizontal: wp(2),
        paddingVertical: hp(1.1),
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        width: wp(4.5),
        height: hp(4.5),
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: wp(2),
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchRow: {
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
    },
    searchInput: {
        backgroundColor: colors.white,
        borderRadius: hp(1),
        paddingHorizontal: wp(2),
        height: hp(3.6)
    },
});

export default CustomSelect;
