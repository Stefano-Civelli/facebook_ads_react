# Diagram of the Amplify + Lambda Architecture
from diagrams import Diagram, Edge
from diagrams.aws.network import APIGateway
from diagrams.aws.compute import Lambda
from diagrams.aws.mobile import Amplify
from diagrams.onprem.client import User

# Define the diagram
with Diagram("Amplify + Lambda Architecture", show=False):
    
    # Create User Node
    user = User("User")

    # Create AWS Amplify Node
    amplify = Amplify("Next.js App")
    
    # Create API Gateway Node
    api_gateway = APIGateway("API Gateway")

    # Create AWS Lambda Node
    lambda_function = Lambda("Flask Backend")

    # Define the flow
    user >> amplify >> api_gateway >> lambda_function
