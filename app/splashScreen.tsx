import LottieView from "lottie-react-native";
import splash from "../assets/lotties/splashLottie.json"; // Asegúrate de que la ruta sea correcta

export default function SplashScreen({
    onFinish = (isCancelled) => {},
}: {
    onFinish?: (isCancelled: boolean) => void;
}) {
    return (
     
            <LottieView
                source={splash}
                onAnimationFinish={onFinish}
                autoPlay
                resizeMode="cover"
                loop={false}
                style={{
                    flex: 1,
                    width: "100%",
                }}
            />

    );
}
