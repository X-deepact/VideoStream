FROM golang:1.23.2-alpine as builder

WORKDIR /app
COPY . .
RUN apk update && \
    apk add -U build-base git curl libstdc++ ca-certificates && \
    go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o be-live-admin.linux .    

FROM alpine:latest
RUN apk add --no-cache tzdata
WORKDIR /app
COPY --from=builder /app/ ./

RUN chmod +x /app/be-live-admin.linux
EXPOSE 8686
ENTRYPOINT ["/app/be-live-admin.linux"]