export const fileImages: { [key: string]: string } = {
  pdf: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADYklEQVR4nO3az6sOURzH8bdft4uFHwtF3MRCspENdnfhD6BIIQvuwtLaSlI2dlaKJHQ3dtydwoItUpKsSHTzIy5y/RqdGjWdzjwz8zz3PvM9Zz6fOov7zHxnuuf1nDNz5hlonizS9hs4QoJpu2MzoaQDkqU4Utru0EwovUGsJ0t9pKQCkqWCEjvIr8DfB4k4sYPsD6BEPVJiByE1lBRAkkJJBSQZlJRAkkBJDSR6lBRBokZJFSRalJRBokRJHSQ6lC6ARIXSFZBoULoEEgVK10DMo3QRxDRKV0HMonQZxCRK10HMoQjEGIpAjKEIxBhK7CDZkNrQUARCbRQ3cgRiZIQMbQbRCEEgMUUjxFgEYiwCMRaBGItAjEUgxiIQYxGIsQjEWARiLAIxFoEYi0CMRSDGIhBjEYixRAtyHLgPvAO+5sf6AbwGpoAJYHlJ7VXgKfAxf5ngD/ABeAicAzZXnHs6r+3VTnQN5HKNn0JfAtsDtd9qvPFxBlhUcm7/tZ1QO9nn/5UUyPfAZ2+BtRUgn3IEv/Z8ybkFUgHiOnNZ/vlW4K7XsRd6gFzLP1sCHM6nm2LtvgoQd649gTZGh0eI//7SCuBzYbub8xdUgPzPTq/DH3u1eNsnmdskCRKa0jZSD8Tlilc77m0XSB8gp7xO3dEAZNyrPS2QwUHOep26pQHIKDBb2OeOQAYHuVnY/rNw0a8D4vKisM8rgQwGMubdArsFJA1B7hX2mRFI/yC7gWfedLW3D5Ap7xgjJRf12ZKVurvT6+xdlmtvAmsI124EauuA3PaOs7ThwnBl10Eyr/0FLgKLA7VNpyz3jKwYgTQAmQauA7t6YNYBeeQ9fikDuQVsCrSFdHiEuA5a5d1JMSBIcaX/xNumhWENkCapAtngfWkuedsFMmSQCQ/kmEDaBXngHXu9QNoDOeSNjtDTXE1ZQwAZyX92La7w3X7bBDJckBngOfAlsI45WlKvETKPIFmguVveAz3qBTLHIO8DCLP5xdz9jrK6ol4g85BRYF2+ql5T8oiljUS7Uk81mUBsRSDGIhBjEYixCMRYBGIsAjEWgRiLQIxFIMYiEGMRiLEIxFgEYiwCMRaBGItAjEUgxiIQYxGIsQjEWARiLK2DqNGzDwSCrS+JQGgfQSC03/FzAvIP3QZ9qC0X9bAAAAAASUVORK5CYII=",
  doc: "data:image/png;base64,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",
  docx: "data:image/png;base64,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",
  ppt: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEI0lEQVR4nO2cT6gWVRjGf/5bhBguEkQTiUglJAhMKyJTWmhGYJRYgYsgQSJxEy50IRLkooWCYOauRa0iEGrjQl21SLy0SCK0iEISUcr/f+/IgSNMhzPe77v35vOeM+8P3s2cOfM93/PMmW9mvjkDjuM4jvPwaQqrEeAxKqYpsE4B86iUptD6BZhPhTQF1+/AE1RG+iWt0nTUH8CTVETpgTTAWeBpKqGGQBrgb2ApFVBqIF9mlp0DnqFwSg1kCrA/s/wisJyCKTUQYih7M23/AC9QKCUHcp9PMu1XgFUUSA2BBHZl1rkKvEph1BJIYHtmvRvAGxRETYEEPs6sexNYTyHUFkhgCzCarH8LeIsCqDGQwAfA3aTPHWATxqk1kMC7wO1MKO9jmJoDCWzMhBIOZx9hlNoDIf523MqEsg2D9CGQwDrgemY7OzFGXwIJrAGuZba1B0P0KZDASuCy5VD6FkjgJeDfzDY/izcspfQxkMAy4EJmuweAqQjpayCBZ4HzmW0fUobS50CI/8WfzWz/K2A6AkoNpHkI9bWFL2qVRlTyL2qVxgOxReOB9JNGfcSQCzCG3A+5AGPI/ZALMIbcD7kAY8j9kAswhtwPuQBjyP2QCzCG3A+5AGPI/ZALMIbcD7kAY8j9kAswhtwPuQBjyP2YLAH7gB+Bv+K0smvxP+uTwEHg+UyfucC3wM9xfuClWGEC5/E452NB0uc74MyA9XKfAzkzxi3y0Tj9rP1Ux5IBbqlfSp5a/2mI2/BrhH6YD6SJtWPIQJr4GOiK2McDGWcgb8bHNw9n9vhHOwL5NT7I9h5wOmn7PvYJh78jsU4k65xrtYV6bhw7VrUjZHZcPjW+vafd9npHID+0tvdUMr8jTE17JPnMV5L+3zBxqg8k8GnStnWAQHKHpxBSGw9knIFsT9q2DRjIsaR9kQcyOYF8kbRtGCCQcDb2Z6vtbuu3x0fIBAJ5PP6Qt09/5w0QyDtJW7ieSfFD1hCBfAjsjhd57eXhQpCOQH6LkzU/z0xD2+yBTP51yAVg4QMC6aqjwDQPZHIDGQEWJ33GCmQ0voZpZsdn+iFriEBG4p4dXqG0tmMizJLMC2NOxIvA3QO8kMwDGedZVhdjnfaOhQfyADyQgq7Uu/ARksED6eG9rC58hGTwQP6LjxD8LOt/2SNeA95u1YwB+sxK+qwe8jPnJP1fZOJUM0JqoVH7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H3IBxpD7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H3IBxpD7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H3IBxpD7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H6kALzyQxvCO4CMEfQgeCHrjzQTiOI7j0GvuAVy40tW9OgBUAAAAAElFTkSuQmCC",
  pptx: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEI0lEQVR4nO2cT6gWVRjGf/5bhBguEkQTiUglJAhMKyJTWmhGYJRYgYsgQSJxEy50IRLkooWCYOauRa0iEGrjQl21SLy0SCK0iEISUcr/f+/IgSNMhzPe77v35vOeM+8P3s2cOfM93/PMmW9mvjkDjuM4jvPwaQqrEeAxKqYpsE4B86iUptD6BZhPhTQF1+/AE1RG+iWt0nTUH8CTVETpgTTAWeBpKqGGQBrgb2ApFVBqIF9mlp0DnqFwSg1kCrA/s/wisJyCKTUQYih7M23/AC9QKCUHcp9PMu1XgFUUSA2BBHZl1rkKvEph1BJIYHtmvRvAGxRETYEEPs6sexNYTyHUFkhgCzCarH8LeIsCqDGQwAfA3aTPHWATxqk1kMC7wO1MKO9jmJoDCWzMhBIOZx9hlNoDIf523MqEsg2D9CGQwDrgemY7OzFGXwIJrAGuZba1B0P0KZDASuCy5VD6FkjgJeDfzDY/izcspfQxkMAy4EJmuweAqQjpayCBZ4HzmW0fUobS50CI/8WfzWz/K2A6AkoNpHkI9bWFL2qVRlTyL2qVxgOxReOB9JNGfcSQCzCG3A+5AGPI/ZALMIbcD7kAY8j9kAswhtwPuQBjyP2QCzCG3A+5AGPI/ZALMIbcD7kAY8j9kAswhtwPuQBjyP2YLAH7gB+Bv+K0smvxP+uTwEHg+UyfucC3wM9xfuClWGEC5/E452NB0uc74MyA9XKfAzkzxi3y0Tj9rP1Ux5IBbqlfSp5a/2mI2/BrhH6YD6SJtWPIQJr4GOiK2McDGWcgb8bHNw9n9vhHOwL5NT7I9h5wOmn7PvYJh78jsU4k65xrtYV6bhw7VrUjZHZcPjW+vafd9npHID+0tvdUMr8jTE17JPnMV5L+3zBxqg8k8GnStnWAQHKHpxBSGw9knIFsT9q2DRjIsaR9kQcyOYF8kbRtGCCQcDb2Z6vtbuu3x0fIBAJ5PP6Qt09/5w0QyDtJW7ieSfFD1hCBfAjsjhd57eXhQpCOQH6LkzU/z0xD2+yBTP51yAVg4QMC6aqjwDQPZHIDGQEWJ33GCmQ0voZpZsdn+iFriEBG4p4dXqG0tmMizJLMC2NOxIvA3QO8kMwDGedZVhdjnfaOhQfyADyQgq7Uu/ARksED6eG9rC58hGTwQP6LjxD8LOt/2SNeA95u1YwB+sxK+qwe8jPnJP1fZOJUM0JqoVH7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H3IBxpD7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H3IBxpD7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H3IBxpD7IRdgDLkfcgHGkPshF2AMuR9yAcaQ+yEXYAy5H6kALzyQxvCO4CMEfQgeCHrjzQTiOI7j0GvuAVy40tW9OgBUAAAAAElFTkSuQmCC",
  xls: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEy0lEQVR4nO2ca8hlUxzGf6/LoKZcwgfKdURvGk0mGglTihJSI7fSDMm9fCA1zQdCEeXShFJoPpD4wHzBF5FbPjBfhNIYl3rDZBp3xmVr1Tq1+7eO3nP2nnn++3/Wr1a9rbXPOs95nnftfc7aay+oVCqVSmXP0wysbAEOJTDNAMsnwBEEpRlo+Qw4koA0Ay7bgGMJhv2QXmnGlK+A4wnE0ANpgAVgniBECKQBvgVOJgBDDWRToe47YDkDZ6iBzAEbC/U7gNMYMEMNhBzKI4W2ncAqBsqQAxlxb6H9F2A1AyRCIIm7Csf8CpzLwIgSSOLOwnF/ABcxICIFkrijcOyfwCUMhGiBJG4E/jXH7wLWMAAiBpK4DvjHvOZv4GqcEzWQxJXAX4VQrsExkQNJXF4IJZ3ObsUp0QMhXzt2FUK5DYfMQiCJC4DfC/1swBmzEkjifOC3Ql/344hZCiRxNvCz51BmLZDEmcCPhT4fyhOWUmYxkMRK4IdCv08AeyFkVgNJrAC2F/p+ShnKLAdCvhe/UOj/OWAfBAw1kGYPlOc9fFCvNKIi/6BeaWogvmhqILNJoz5jyAU4Q+6HXIAz5H7IBThD7odcgDPkfsgFOEPuh1yAM+R+yAU4Q+6HXIAz5H7IBThD7odcgDPkfsgFOEPuh1xAR9JNpAMI5EdfAm4BtrbKfab9YdOe7mknXjD1yxbxXukx6MeBL1u6vwc29/DgZ5hATjArzr9preCYM7dJt7XuWb9t3n9+EasQS2urRqXrAzphAkm8Z/pameuXm/q7W6+ZJJAV+QGc5n/KYR0/Q6hAbjB93ZPrb2/VpVF03JSBvGyO/Tw/oHMt8ADwPt0JFcjB5j94S65/tVX3pnnNYgNZYk5VO3bTNk2hAkm8aEbDMWbp5topAznKHPcOu4dwgVxo+nu69XcKZumUgRxYeBa9jpBFsG/+CtoeJaO/nykcP8k15GNz7Id55PRJuBGSeHTMN6C08rxLIGsLff4EXE9/hAzk1EK/W8esLJ8kkLm8xHPcKkN7OpyGkIGcXuh33EV40h+G+wPPjgllcw+LpEMGsrHQb7qWnNRDICPW5dOVfZ+bOmoPF8iSMUv8U3mwx0BGc1qfFjbH7EK4QC5u9ZUesnzFbDCWAusrEPKvfjudkn6gTku4QF5q9fUGcJXpf03PgSQ+MH2c2EF/6KmTDcAh5sH913oOJF3EvzDXqjpCxkwursr1b7Xq0v4jR08ZyHrgjNYNqYOAx8zrP6IboUbIu61+tgN75/qbJ5h+L5W0Z8l+ZqTtHHPsFR0/Q5hAlplpkk2ttsONmV+3wlpsIPaeSqk8SXfCBGK32LvMtL9u2tNWF5MEck7esq/UvpCnT/p4xjxMIGme6tJWWWra5037Kbl+takvldEEYurzvLwX1vq8o89Zha/SXQgTSBQatR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPshF+AMuR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPshF+AMuR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPshF+AMuR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPthBdRCDaRx/I9QRwj6EGog6I13E0ilUqlUmGn+A7Y7t/YwBEUZAAAAAElFTkSuQmCC",
  xlsx: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEy0lEQVR4nO2ca8hlUxzGf6/LoKZcwgfKdURvGk0mGglTihJSI7fSDMm9fCA1zQdCEeXShFJoPpD4wHzBF5FbPjBfhNIYl3rDZBp3xmVr1Tq1+7eO3nP2nnn++3/Wr1a9rbXPOs95nnftfc7aay+oVCqVSmXP0wysbAEOJTDNAMsnwBEEpRlo+Qw4koA0Ay7bgGMJhv2QXmnGlK+A4wnE0ANpgAVgniBECKQBvgVOJgBDDWRToe47YDkDZ6iBzAEbC/U7gNMYMEMNhBzKI4W2ncAqBsqQAxlxb6H9F2A1AyRCIIm7Csf8CpzLwIgSSOLOwnF/ABcxICIFkrijcOyfwCUMhGiBJG4E/jXH7wLWMAAiBpK4DvjHvOZv4GqcEzWQxJXAX4VQrsExkQNJXF4IJZ3ObsUp0QMhXzt2FUK5DYfMQiCJC4DfC/1swBmzEkjifOC3Ql/344hZCiRxNvCz51BmLZDEmcCPhT4fyhOWUmYxkMRK4IdCv08AeyFkVgNJrAC2F/p+ShnKLAdCvhe/UOj/OWAfBAw1kGYPlOc9fFCvNKIi/6BeaWogvmhqILNJoz5jyAU4Q+6HXIAz5H7IBThD7odcgDPkfsgFOEPuh1yAM+R+yAU4Q+6HXIAz5H7IBThD7odcgDPkfsgFOEPuh1xAR9JNpAMI5EdfAm4BtrbKfab9YdOe7mknXjD1yxbxXukx6MeBL1u6vwc29/DgZ5hATjArzr9preCYM7dJt7XuWb9t3n9+EasQS2urRqXrAzphAkm8Z/pameuXm/q7W6+ZJJAV+QGc5n/KYR0/Q6hAbjB93ZPrb2/VpVF03JSBvGyO/Tw/oHMt8ADwPt0JFcjB5j94S65/tVX3pnnNYgNZYk5VO3bTNk2hAkm8aEbDMWbp5topAznKHPcOu4dwgVxo+nu69XcKZumUgRxYeBa9jpBFsG/+CtoeJaO/nykcP8k15GNz7Id55PRJuBGSeHTMN6C08rxLIGsLff4EXE9/hAzk1EK/W8esLJ8kkLm8xHPcKkN7OpyGkIGcXuh33EV40h+G+wPPjgllcw+LpEMGsrHQb7qWnNRDICPW5dOVfZ+bOmoPF8iSMUv8U3mwx0BGc1qfFjbH7EK4QC5u9ZUesnzFbDCWAusrEPKvfjudkn6gTku4QF5q9fUGcJXpf03PgSQ+MH2c2EF/6KmTDcAh5sH913oOJF3EvzDXqjpCxkwursr1b7Xq0v4jR08ZyHrgjNYNqYOAx8zrP6IboUbIu61+tgN75/qbJ5h+L5W0Z8l+ZqTtHHPsFR0/Q5hAlplpkk2ttsONmV+3wlpsIPaeSqk8SXfCBGK32LvMtL9u2tNWF5MEck7esq/UvpCnT/p4xjxMIGme6tJWWWra5037Kbl+takvldEEYurzvLwX1vq8o89Zha/SXQgTSBQatR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPshF+AMuR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPshF+AMuR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPshF+AMuR9yAc6Q+yEX4Ay5H3IBzpD7IRfgDLkfcgHOkPthBdRCDaRx/I9QRwj6EGog6I13E0ilUqlUmGn+A7Y7t/YwBEUZAAAAAElFTkSuQmCC",
  txt: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEHklEQVR4nO2cTYhWVRzGf0q1UCjCCHVo0QQtwj6ECEUjog+CMBASosUERUILQYSwRQtBqQhDg6CgFlpQm6DFtMqFG0FchBAhbmL6gCGRPvw2064cuC8eDue+NTHvff7n3P8PzmLO+d9zn/d55t6Z+/EecBzHcZz+aQprx4E7qJimwHYCWE2lNIW2k8AUFdIU3OaAu6mM9ENapeloPwH3UBGlB9IA88B9VEINgTTAr8AaKqDUQD7N9J0CHqBwSg1kCfBBpv934BEKptRAaEPZnxn7E1hPoZQcyIg9mfHzwOMUSA2BBHZlai4AT1IYtQQS2Jmpuww8R0HUFEjg9UztX8BmCqG2QAKvAf8k9VeA5ymAGgMJvApcS7a5CsxgnFoDCbwI/J0J5WUMU3MggRcyoYTT2TaMUnsgtH87rmRC2Y5BhhBI4FngUmaeNzHGUAIJPANczMz1DoYYUiCBx4BzlkMZWiCBjcCZzJx72xuWUoYYSOBh4LfMvB8CSxEy1EACa4HTmbk/VoYy5EBon8XPZ+b/HLgJAaUG0vTQvrDwQa3SiJr8g1ql8UBs0Xggw6RRnzHkAowh90MuwBhyP+QCjCH3Qy7AGHI/5AKMIfdDLsAYcj/kAowh90MuwBhyP+QCjCH3Qy7AGHI/5AKMIfdDLsAYcj8WQ8CdwA8LaIHZpG8DNwhP6r6Pxo62j1Tjvn9rdzHgQFYv8PZ44I2kbx83eDQZe6/tv7CAfUzz/xhsIFPti8+jvh+jV3B2J/UPtv0eyH9kBXAoanOZxWLi8RHfJHXhLZDAsajv26j+62iOE8m2c8k+Vg35CEl5O5lza0fdTOY929uSI6frLfWtybZhn4vBoANZDpyN6o603weMv4rWtTaWBzKBQAIHorpwZByMfv6SbjyQCQXyRFIbn642eSD9B7IU+Llj3ZKbPZD+Awm81fEm+jj8lDXBQN7NBLLDA+n/v6zRKeuXTCDhOmMcfoRMKJCnx1zRr/NA+g/ks6huNrku+cQD6f/C8FxUF5bE+CpZYunWjm39lDWBQF5K6u4FXkn6whIZHkhPgRyKasK1SGBlskZJuNHogfQQyFRyVf5RNHY42f6hzPZ+ylrkQHYmNZvGmP2+BzL5QL6LxsOSF8uisdvbO72j8T+S8Vxofvt9DPcDW6KWPk69JRl/quP6JK4JD8FippPxsM/FoMrnISUj90MuwBhyP+QCjCH3Qy7AGHI/5AKMIfdDLsAYcj/kAowh90MuwBhyP+QCjCH3Qy7AGHI/5AKMIfdDLsAYcj/kAowh90MuwBhyP+QCjCH3Qy7AGHI/5AKMIfdDLsAYcj/kAowh90MuwBhyP+QCjCH3Qy7AGHI/5AKMIfdDLsAYcj9SAd7wQBrDvwh+hKAPwQNBb7yZQBzHcRwGzXXMzbM9HEvWegAAAABJRU5ErkJggg==",
  default:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACAklEQVR4nO2awUoDQRAF+09FT/7/VbS9hxAIbqzqnlewB28vVTMLkVSFEEII/08Pfb6q6q0W0oOfn6r6rGXQUjtRdgXpbTfl9sPZ6e1RtgTpLVGmB/m+8/dHDWZ6kPc7UUbflOlBaluUDUFWRdkSZE2UTUFWRNkWZHyUjUFGR9kaZGyUzUFGRtkeZFyUE4KMinJKkDFRTgoyIsppQfRRTgyijnJqEG2Uk4Moo0wP0i96vqnffSVIPfwxXoJIbgj2xsAHPEmCHEbTBxQfIAP3gQ+QgfvAB8jAfeADZOA+8AEycB/4ABm4D3yADNwHPkAG7gMfIAP3gQ+QgfvAB8jAffx1QMufZ0mQSpBLTwR9Azo3JEFeCv7OlIH7wAfIwH3gA2TgPvABMnAf+AAZuA98gAzcBz5ABu4DHyAD9zH9m/rVJEglyKUnIjfkYhJk2StrG037wAfIwH3gA2TgPvABMnAf+AAZuA98gAzcBz5ABu4DHyAD9zH9i2Ff/L+uBKkEyQ15QG5I5Ya4ToQM3Ac+QAbuAx8gA/eBD5CB+8AHyMB94ANk4D7wATJwH/gAGbgPfIAM3Ac+QAbuAx8gA/eBD5CB+8AHyMB94ANk4D7wATJwH/gAGbgPfIAM3Ac+QAbuAx8gA/eBD5CB+7gdkKcSpMUHITek+AgJUrx4TZAQQgh1NL82UAuj8u1i3wAAAABJRU5ErkJggg==",
};

export const getFileImage = (key: string, defaultKey: string = "default"): string => {
  return fileImages[key] || fileImages[defaultKey];
};
