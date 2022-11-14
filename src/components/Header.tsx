import { Text, HStack, Box } from 'native-base';
import { CaretLeft, Export } from 'phosphor-react-native';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ButtonIcon } from './ButtonIcon';
import { Pages } from '../@types/navigation';


interface Props {
  title: string;
  showBackButton?: boolean;
  showShareButton?: boolean;
  onShare?: () => void
  navigateBackScreen?: keyof Pages
}

export function Header({ title, showBackButton = false, showShareButton = false, onShare, navigateBackScreen }: Props) {
  const EmptyBoxSpace = () => (<Box w={5} h={5} />);

  const navigation = useNavigation();



  return (
    <HStack w="full" h={24} bgColor="gray.800" alignItems="flex-end" pb={4} px={4}>
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {
          showBackButton
            ? <ButtonIcon icon={CaretLeft}
              onPress={() => {
                console.log(navigateBackScreen)
                !navigateBackScreen ? navigation.goBack() : navigation.navigate(navigateBackScreen)
              }} />
            : <EmptyBoxSpace />
        }

        <Text color="white" fontFamily="medium" fontSize="md" textAlign="center">
          {title}
        </Text>

        {
          showShareButton
            ?
            <ButtonIcon icon={Export} onPress={onShare} />
            :
            <EmptyBoxSpace />
        }
      </HStack>
    </HStack>
  );
}