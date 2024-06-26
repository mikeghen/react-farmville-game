import { useState, useEffect } from "react";
import { Container, Button, VStack, Text, Box, Image, useToast, SimpleGrid, Icon, HStack, Badge } from "@chakra-ui/react";
import { FaSeedling, FaTint, FaDollarSign, FaHandHoldingWater } from "react-icons/fa";

const Index = () => {
  const [money, setMoney] = useState(100);
  const [seeds, setSeeds] = useState(0);
  const [plants, setPlants] = useState(0);
  const [farmGrid, setFarmGrid] = useState(Array(100).fill({ state: "empty" }));
  const [mode, setMode] = useState("planting");
  const toast = useToast();

  // Removed unused useEffect block

  const buySeeds = () => {
    if (money >= 10) {
      setMoney(money - 10);
      setSeeds(seeds + 1);
      toast({
        title: "Seeds purchased!",
        description: "You have bought a seed.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Not enough money!",
        description: "You need more money to buy seeds.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleGridClick = (index) => {
    switch (mode) {
      case "planting":
        if (seeds > 0 && farmGrid[index].state === "empty") {
          setSeeds(seeds - 1);
          const newGrid = [...farmGrid];
          newGrid[index] = { state: "seeded", id: Date.now(), image: "/seed.png" };
          setFarmGrid(newGrid);
          toast({
            title: "Seeds planted!",
            description: "Your seeds have been planted. Remember to water them!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: "No seeds to plant!",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
        break;
      case "watering":
        if (farmGrid[index].state === "seeded") {
          const newGrid = [...farmGrid];
          newGrid[index] = { ...farmGrid[index], state: "germination" };
          setFarmGrid(newGrid);
          toast({
            title: "Plant watered!",
            description: "Your plant has been watered. It's germinating!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          setTimeout(() => {
            setFarmGrid((prevGrid) => {
              const updatedGrid = [...prevGrid];
              if (updatedGrid[index].id === newGrid[index].id) {
                updatedGrid[index] = { ...updatedGrid[index], state: "seedling" };
              }
              return updatedGrid;
            });
          }, 3000);

          setTimeout(() => {
            setFarmGrid((prevGrid) => {
              const updatedGrid = [...prevGrid];
              if (updatedGrid[index].id === newGrid[index].id) {
                updatedGrid[index] = { ...updatedGrid[index], state: "growing" };
              }
              return updatedGrid;
            });
          }, 6000);

          setTimeout(() => {
            setFarmGrid((prevGrid) => {
              const updatedGrid = [...prevGrid];
              if (updatedGrid[index].id === newGrid[index].id) {
                updatedGrid[index] = { ...updatedGrid[index], state: "mature" };
              }
              return updatedGrid;
            });
          }, 9000);
        }
        break;
      case "harvesting":
        if (farmGrid[index].state === "mature" || farmGrid[index].state === "growing") {
          const newGrid = [...farmGrid];
          newGrid[index] = { state: "empty" };
          setFarmGrid(newGrid);
          setPlants((prevPlants) => prevPlants + 1);
          console.log(`Harvested plant at index ${index}. Total plants: ${plants + 1}`);
          toast({
            title: "Plant harvested!",
            description: "Your plant has been harvested. The plot is now empty and ready for new seeds!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
        break;
      default:
        break;
    }
  };

  const waterPlants = () => {
    const newGrid = farmGrid.map((cell) => {
      if (cell.state === "seeded") {
        return { ...cell, state: "growing" };
      }
      return cell;
    });
    setFarmGrid(newGrid);
    toast({
      title: "Plants watered!",
      description: "All seeded plants have been watered. Wait for them to grow!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const harvestPlants = () => {
    const newGrid = farmGrid.map((cell, index) => {
      if (cell.state === "mature") {
        setPlants((prevPlants) => prevPlants + 1);
        return { ...cell, state: "empty" };
      }
      return cell;
    });
    setFarmGrid(newGrid);
    toast({
      title: "Plants harvested!",
      description: "You have harvested your plants. You can sell them now!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const sellPlants = () => {
    if (plants > 0) {
      setMoney(money + 20 * plants);
      setPlants(0);
      toast({
        title: "Plants sold!",
        description: `You have sold your plants for $${20 * plants}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No plants to sell!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Box p={4} bg="blue.500" color="white" display="flex" justifyContent="space-between">
        <Text fontSize="3xl">Saverville Farm</Text>
        <HStack spacing={4}>
          <Button colorScheme="green" onClick={buySeeds}>
            Buy Seeds
          </Button>
          <Button colorScheme="red" onClick={sellPlants}>
            Sell Plants
          </Button>
          <Text fontSize="xl" textAlign="right">
            Wallet: ${money}
          </Text>
        </HStack>
      </Box>
      <HStack justifyContent="space-between">
        <HStack spacing={4}>
          <Button colorScheme="green" onClick={() => setMode("planting")} bg={mode === "planting" ? "green.500" : "green.200"}>
            Plant
          </Button>
          <Button colorScheme="blue" onClick={() => setMode("watering")} bg={mode === "watering" ? "blue.500" : "blue.200"}>
            Water
          </Button>
          <Button colorScheme="orange" onClick={() => setMode("harvesting")} bg={mode === "harvesting" ? "orange.500" : "orange.200"}>
            Harvest
          </Button>
        </HStack>
        <HStack spacing={4}>
          <Box p={2} borderRadius="md" display="flex" alignItems="center">
            <Image src="/germination.png" alt="Seeds" boxSize="30px" />
            <Text ml={2}>x {seeds}</Text>
          </Box>
          <Box p={2} borderRadius="md" display="flex" alignItems="center">
            <Image src="/harvest.png" alt="Plants" boxSize="30px" />
            <Text ml={2}>x {plants}</Text>
          </Box>
        </HStack>
      </HStack>

      <HStack spacing={4}>
        <Box flex="1">
          <Image src={mode === "planting" ? "/planting.png" : mode === "watering" ? "/watering.png" : "/harvesting.png"} alt={`${mode} mode`} boxSize="100%" />
        </Box>
        <SimpleGrid columns={10} spacing={4} flex="2">
          {farmGrid.map((cell, index) => (
            <Box key={index} w="50px" h="50px" borderWidth="2px" borderColor="#5D3A00" borderRadius="lg" bg="#A0522D" display="flex" alignItems="center" justifyContent="center" onClick={() => handleGridClick(index)}>
              {cell.state === "seeded" && <Image src={cell.image} alt="Seed" boxSize="100%" />}
              {cell.state === "germination" && <Image src="/germination.png" alt="Germination" boxSize="100%" />}
              {cell.state === "seedling" && <Image src="/seedling.png" alt="Seedling" boxSize="100%" />}
              {cell.state === "growing" && <Image src="/growing.png" alt="Growing" boxSize="100%" />}
              {cell.state === "mature" && <Image src="/harvest.png" alt="Harvest" boxSize="100%" />}
            </Box>
          ))}
        </SimpleGrid>
      </HStack>
    </VStack>
  );
};

export default Index;
