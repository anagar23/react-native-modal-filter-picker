import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet
} from 'react-native'

export default class ModalFilterPicker extends Component {
  constructor(props, ctx) {
    super(props, ctx)

    this.state = {
      filter: '',
      ds: props.options
    }
  }

  componentWillReceiveProps(newProps) {
    if ((!this.props.visible && newProps.visible) || (this.props.options !== newProps.options)) {
      this.setState({
        filter: '',
        ds: newProps.options,
      })
    }
  }

  render() {
    const {
      title,
      titleTextStyle,
      overlayStyle,
      cancelContainerStyle,
      renderList,
      renderCancelButton,
      visible,
      modal,
      onCancel
    } = this.props

    const renderedTitle = (!title) ? null : (
      <Text style={titleTextStyle || styles.titleTextStyle}>{title}</Text>
    )

    return (
      <Modal
        onRequestClose={onCancel}
        {...modal}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={overlayStyle || styles.overlay}
          enabled={Platform.OS === 'ios'}
        >
          <View>{renderedTitle}</View>
          {(renderList || this.renderList)()}
          <View style={cancelContainerStyle || styles.cancelContainer}>
            {(renderCancelButton || this.renderCancelButton)()}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  renderList = () => {
    const {
      showFilter,
      autoFocus,
      listContainerStyle,
      androidUnderlineColor,
      placeholderText,
      placeholderTextColor,
      filterTextInputContainerStyle,
      filterTextInputStyle
    } = this.props

    const filter = (!showFilter) ? null : (
      <View style={filterTextInputContainerStyle || styles.filterTextInputContainer}>
        <TextInput
          onChangeText={this.onFilterChange}
          autoCorrect={false}
          blurOnSubmit={true}
          autoFocus={autoFocus}
          autoCapitalize="none"
          underlineColorAndroid={androidUnderlineColor}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholderText}
          style={filterTextInputStyle || styles.filterTextInput} />
      </View>
    )

    return (
      <View style={listContainerStyle || styles.listContainer}>
        {filter}
        {this.renderOptionList1()}
      </View>
    )
  }

  renderOptionList1 = () => {
    const {
      noResultsText,
      listViewProps,
      keyboardShouldPersistTaps
    } = this.props

    const ds = this.state.ds

    if (1 > ds.length) {
      return (
        <FlatList
          enableEmptySections={false}
          {...listViewProps}
          data={[{ key: '_none' }]}
          renderItem={(item) => (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{noResultsText}</Text>
            </View>
          )}
        />
      )
    } else {
      return (
        <FlatList
          enableEmptySections={false}
          {...listViewProps}
          data={ds}
          renderItem={this.renderOption1}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        />
      )
    }
  }

  renderOption1 = ({ item, index }) => {
    const {
      selectedOption,
      renderOption,
      optionTextStyle,
      selectedOptionTextStyle
    } = this.props

    const { key, label } = item

    let style = styles.optionStyle
    let textStyle = optionTextStyle || styles.optionTextStyle

    if (key === selectedOption) {
      style = styles.selectedOptionStyle
      textStyle = selectedOptionTextStyle || styles.selectedOptionTextStyle
    }

    if (renderOption) {
      return renderOption(rowData, key === selectedOption)
    } else {
      return (
        <TouchableOpacity activeOpacity={0.7}
          style={style}
          onPress={() => this.props.onSelect(key)}
        >
          <Text style={textStyle}>{label}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderCancelButton = () => {
    const {
      cancelButtonStyle,
      cancelButtonTextStyle,
      cancelButtonText
    } = this.props

    return (
      <TouchableOpacity onPress={this.props.onCancel}
        activeOpacity={0.7}
        style={cancelButtonStyle || styles.cancelButton}
      >
        <Text style={cancelButtonTextStyle || styles.cancelButtonText}>{cancelButtonText}</Text>
      </TouchableOpacity>
    )
  }

  onFilterChange = (text) => {
    const { options } = this.props

    const filter = text.toLowerCase()

    // apply filter to incoming data
    const filtered = (!filter.length)
      ? options
      : options.filter(({ searchKey, label, key }) => (
        0 <= label.toLowerCase().indexOf(filter) ||
        (searchKey && 0 <= searchKey.toLowerCase().indexOf(filter))
      ))

    this.setState({
      filter: text.toLowerCase(),
      ds: filtered
    })
  }
}

ModalFilterPicker.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  androidUnderlineColor: PropTypes.string,
  cancelButtonText: PropTypes.string,
  title: PropTypes.string,
  noResultsText: PropTypes.string,
  visible: PropTypes.bool,
  showFilter: PropTypes.bool,
  modal: PropTypes.object,
  selectedOption: PropTypes.string,
  renderOption: PropTypes.func,
  renderCancelButton: PropTypes.func,
  renderList: PropTypes.func,
  listViewProps: PropTypes.object,
  filterTextInputContainerStyle: PropTypes.any,
  filterTextInputStyle: PropTypes.any,
  cancelContainerStyle: PropTypes.any,
  cancelButtonStyle: PropTypes.any,
  cancelButtonTextStyle: PropTypes.any,
  titleTextStyle: PropTypes.any,
  overlayStyle: PropTypes.any,
  listContainerStyle: PropTypes.any,
  optionTextStyle: PropTypes.any,
  selectedOptionTextStyle: PropTypes.any,
  keyboardShouldPersistTaps: PropTypes.string
}

ModalFilterPicker.defaultProps = {
  placeholderText: 'Filter...',
  placeholderTextColor: '#ccc',
  androidUnderlineColor: 'rgba(0,0,0,0)',
  cancelButtonText: 'Cancel',
  noResultsText: 'No matches',
  visible: true,
  showFilter: true,
  keyboardShouldPersistTaps: 'never'
}

const { width, height } = Dimensions.get('window')

const optionStyle = {
  flex: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee'
}

const optionTextStyle = {
  flex: 1,
  textAlign: 'left',
  color: '#000',
  fontSize: 22
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTextStyle: {
    flex: 0,
    color: '#fff',
    fontSize: 20,
    marginBottom: 15
  },
  listContainer: {
    flex: 1,
    width: width * 0.8,
    maxHeight: height * 0.7,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 15
  },
  cancelContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButton: {
    flex: 0,
    backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 18
  },
  filterTextInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#999'
  },
  filterTextInput: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 0,
    height: 50
  },
  categoryStyle: {
    ...optionStyle
  },
  categoryTextStyle: {
    ...optionTextStyle,
    color: '#999',
    fontStyle: 'italic',
    fontSize: 16
  },
  optionStyle: {
    ...optionStyle
  },
  optionStyleLastChild: {
    borderBottomWidth: 0
  },
  optionTextStyle: {
    ...optionTextStyle
  },
  selectedOptionStyle: {
    ...optionStyle
  },
  selectedOptionStyleLastChild: {
    borderBottomWidth: 0
  },
  selectedOptionTextStyle: {
    ...optionTextStyle,
    fontWeight: '700'
  },
  noResults: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  noResultsText: {
    flex: 1,
    textAlign: 'center',
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 22
  }
})