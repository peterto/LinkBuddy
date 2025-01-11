import { useTheme, Card } from "@rneui/themed"

const Card ({ item }) => {
    return (

        <Card containerStyle={[
        styles.card,
        { backgroundColor: theme.colors.background }
        ]}>
        <View style={styles.cardContent}>
            {item.preview_image_url && (
            <TouchableOpacity
                onPress={() => _handlePressButtonAsync(item.preview_image_url)}
            >
                <Card.Image
                source={{ uri: item.preview_image_url }}
                style={styles.image}
                resizeMode="cover"
                />
            </TouchableOpacity>
            )}
            <View style={styles.textContent}>
            <TouchableOpacity onPress={() => _handlePressButtonAsync(item.url)}>
                <Text
                style={[
                    styles.title,
                    { color: theme.colors.text }
                ]}
                numberOfLines={3}
                ellipsizeMode="tail"
                >
                {item.title}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _handlePressButtonAsync(item.url)}>
                <Text
                style={[
                    styles.url,
                    { color: theme.colors.primary }
                ]}
                >
                {item.url}
                </Text>
            </TouchableOpacity>
            <View style={styles.metadataRow}>
                <Text style={[styles.domain, { color: theme.colors.text }]}>
                {getDomainFromUrl(item.url)}
                </Text>
                <Text style={[styles.date, { color: theme.colors.text }]}>
                {moment(item.date_added).format("MMMM D, YYYY")}
                </Text>
            </View>
            </View>
        </View>
        </Card>
    );
};

