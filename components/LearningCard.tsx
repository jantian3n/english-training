'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  LinearProgress,
  Chip,
  Stack,
  Fade,
  Alert,
} from '@mui/material'
import { Word } from '@prisma/client'

interface LearningCardProps {
  word: Word
  options: string[] // Array of 4 definitions (1 correct + 3 distractors)
  onComplete: (isCorrectDefinition: boolean, isCorrectSpelling: boolean, timeTaken: number) => void
}

type Step = 'definition' | 'spelling' | 'result'

export default function LearningCard({ word, options, onComplete }: LearningCardProps) {
  const [step, setStep] = useState<Step>('definition')
  const [selectedDefinition, setSelectedDefinition] = useState<string>('')
  const [spellingInput, setSpellingInput] = useState<string>('')
  const [isCorrectDefinition, setIsCorrectDefinition] = useState(false)
  const [isCorrectSpelling, setIsCorrectSpelling] = useState(false)
  const [startTime] = useState<number>(Date.now())

  // Shuffle options on mount
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  useEffect(() => {
    const correctDef = word.definition
    const allOptions = [correctDef, ...options.filter((opt) => opt !== correctDef)].slice(0, 4)
    setShuffledOptions(allOptions.sort(() => Math.random() - 0.5))
  }, [word, options])

  const handleDefinitionSubmit = () => {
    const correct = selectedDefinition === word.definition
    setIsCorrectDefinition(correct)
    setStep('spelling')
  }

  const handleSpellingSubmit = () => {
    const correct = spellingInput.trim().toLowerCase() === word.word.toLowerCase()
    setIsCorrectSpelling(correct)
    setStep('result')

    // Calculate time taken
    const timeTaken = (Date.now() - startTime) / 1000

    // Call parent callback after short delay to show result
    setTimeout(() => {
      onComplete(isCorrectDefinition, correct, timeTaken)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && spellingInput.trim()) {
      handleSpellingSubmit()
    }
  }

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={step === 'definition' ? 33 : step === 'spelling' ? 66 : 100}
        sx={{ height: 6 }}
      />

      <CardContent sx={{ p: 4 }}>
        {/* Step 1: Show word and example, ask for definition */}
        {step === 'definition' && (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                {word.word}
              </Typography>

              {word.pronunciation && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {word.pronunciation}
                </Typography>
              )}

              <Box
                sx={{
                  bgcolor: 'primary.light',
                  p: 2,
                  borderRadius: 2,
                  my: 3,
                }}
              >
                <Typography variant="body1" gutterBottom>
                  <strong>例句：</strong> {word.exampleSentence}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {word.exampleCn}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                这个单词是什么意思？
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedDefinition}
                  onChange={(e) => setSelectedDefinition(e.target.value)}
                >
                  {shuffledOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleDefinitionSubmit}
                disabled={!selectedDefinition}
                sx={{ mt: 3 }}
              >
                继续
              </Button>
            </Box>
          </Fade>
        )}

        {/* Step 2: Ask for spelling */}
        {step === 'spelling' && (
          <Fade in timeout={500}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Typography variant="h5" fontWeight={600}>
                  拼写单词
                </Typography>
                <Chip
                  label={isCorrectDefinition ? '正确!' : '错误'}
                  color={isCorrectDefinition ? 'success' : 'error'}
                  size="small"
                />
              </Stack>

              <Box
                sx={{
                  bgcolor: 'secondary.light',
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Typography variant="body1" gutterBottom>
                  <strong>释义：</strong> {word.definition}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {word.definitionCn}
                </Typography>
              </Box>

              <Typography variant="body1" gutterBottom>
                根据释义输入单词拼写：
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="在此输入单词..."
                value={spellingInput}
                onChange={(e) => setSpellingInput(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                sx={{ mt: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSpellingSubmit}
                disabled={!spellingInput.trim()}
                sx={{ mt: 3 }}
              >
                提交
              </Button>
            </Box>
          </Fade>
        )}

        {/* Step 3: Show result */}
        {step === 'result' && (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={600} textAlign="center">
                结果
              </Typography>

              <Stack spacing={2} mt={3}>
                <Alert severity={isCorrectDefinition ? 'success' : 'error'}>
                  <strong>释义：</strong>{' '}
                  {isCorrectDefinition ? '正确!' : '错误'}
                </Alert>

                <Alert severity={isCorrectSpelling ? 'success' : 'error'}>
                  <strong>拼写：</strong> {isCorrectSpelling ? '正确!' : '错误'}
                  {!isCorrectSpelling && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      你输入的：<strong>{spellingInput}</strong>
                      <br />
                      正确拼写：<strong>{word.word}</strong>
                    </Typography>
                  )}
                </Alert>
              </Stack>

              <Box
                sx={{
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 2,
                  mt: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  正在加载下一个单词...
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  )
}
